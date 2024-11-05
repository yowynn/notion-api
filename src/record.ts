import type * as rt from './record-types';
import type Client from './client.js';
import type RecordMap from './record-map.js';
import { date2timestamp, timestamp2date } from './converter.js';
import { DuplicateKeyError, ReadonlyModificationError, UnsupportedError } from './error.js';
import { getParentPointer, getPointer } from './record-util.js';
import log from './log.js';

const recordTypeMap: { [key: string]: new (client: Client, record: rt.record, table?: rt.type_of_record) => Record; } = {};

@as_record()
export default class Record {
    static wrap(client: Client, pointer: rt.pointer) {
        const record = client.recordMap.getLocal(pointer);
        const type = (record as any).type;
        let key = pointer.table;
        if (type) {
            key = key + '.' + type;
        }
        const ctor = recordTypeMap[key] ?? recordTypeMap[pointer.table] ?? recordTypeMap.record;
        const obj = new ctor(client, record, pointer.table);
        return obj;
    }

    protected _client: Client;
    private _table!: rt.type_of_record;
    private _id!: rt.string_uuid;
    private _taskCount = 0;

    public get client(): Client {
        return this._client;
    }

    public get recordMap(): RecordMap {
        return this._client.recordMap;
    }

    public get table(): rt.type_of_record {
        return this._table;
    }

    public get id(): rt.string_uuid {
        return this._id;
    }

    public get record(): rt.record {
        return this.recordMap.getLocal({ table: this.table, id: this.id });
    }

    public get pointer(): rt.pointer {
        return getPointer(this.record, this.table)!
    }

    public get parentPointer(): rt.pointer | null {
        return getParentPointer(this.record);
    }

    public get isDirty() {
        return this.recordMap.isDirty(this.pointer);
    }

    public constructor(client: Client, record: rt.record, table?: rt.type_of_record) {
        this._client = client;
        this._id = record.id;
        this._table = table!;
    }

    @readonly_record_accessor('version')
    public accessor version!: number;

    @record_accessor('created_time', timestamp2date, date2timestamp)
    public accessor createdTime!: Date;

    @record_accessor('last_edited_time', timestamp2date, date2timestamp)
    public accessor lastEditedTime!: Date;

    public get(propertyPath: string[]) {
        let record = this.record as any;
        for (let p of propertyPath) {
            record = record?.[p];
        }
        return record;
    }

    public async set(propertyPath: string[], value: any, isDelta: boolean = false) {
        this._taskCount++;
        this.markDirty();
        await this.client.action.updateField(this.pointer, propertyPath, value, isDelta);
        await this.client.action.done(true);
        this._taskCount--;
    }

    public markDirty() {
        this.recordMap.markDirty(this.pointer);
    }

    public async idle() {
        while (this._taskCount > 0) {
            await new Promise(resolve => setTimeout(resolve, 10));
        }
    }

    public async refresh() {
        await this.recordMap.get(this.pointer, this.isDirty);
    }

    public async delete(permanentlyDelete: boolean = false) {
        if (permanentlyDelete) {
            log.warn('permanentlyDelete is not supported yet');
        }
        await this.client.action.delete(this.pointer);
        await this.client.action.done(true);
    }
}

export function record_accessor(path?: string, getter: ((x: any) => any) = x => x, setter: ((x: any) => any) | null = x => x) {
    return function ({ get, set }: ClassAccessorDecoratorTarget<Record, any>, { kind, name }: ClassAccessorDecoratorContext<Record, any>) {
        if (kind === 'accessor') {
            path = path || name as string;
            const propertyPath = (path as string).split('.');
            return {
                get(this: Record) {
                    const data = this.get(propertyPath);
                    return getter(data);
                },
                async set(this: Record, value: any) {
                    if (setter === null) {
                        throw new ReadonlyModificationError('record_accessor', path as string);
                    }
                    const data = setter(value);
                    await this.set(propertyPath, data);
                },
            } as any;
        }
        else {
            throw new UnsupportedError('record_accessor', kind);
        }
    };
}

export function readonly_record_accessor(path?: string, getter = (x: any) => x) {
    return record_accessor(path, getter, null);
}

export function as_record(table: rt.type_of_record | 'record' = 'record', type: string = '') {
    const addToRecordTypeMap = (ctor: new (client: any, record: any) => Record) => {
        let key = table as string;
        if (type) {
            key = key + '.' + type;
        }
        if (recordTypeMap[key]) {
            throw new DuplicateKeyError('addToRecordTypeMap', key);
        }
        recordTypeMap[key] = ctor;
        // console.log('reg record type:', key, ctor)
    }
    return addToRecordTypeMap;
}
