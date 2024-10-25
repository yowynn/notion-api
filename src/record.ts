import type * as rt from './record-types';
import type Client from './client.js';
import { date2timestamp, timestamp2date } from './converter.js';
import { DuplicateKeyError, ReadonlyModificationError, UnsupportedError } from './error.js';
import { getParentPointer, getPointer } from './record-util.js';
import log from './log.js';

const recordTypeMap: { [key: string]: new (client: any, record: any) => Record; } = {};

@as_record()
export default class Record {
    static wrap(client: Client, record: rt.record, table: rt.type_of_record = 'block') {
        const type = (record as any).type;
        let key = table;
        if (type) {
            key = key + '.' + type;
        }
        const ctor = recordTypeMap[key] ?? recordTypeMap[table] ?? recordTypeMap.record;
        const obj = new ctor(client, record);
        if (ctor === Record) {
            obj.table = table;
        }
        return obj;
    }

    private _taskCount = 0;
    protected _client: Client;

    protected get recordMap() {
        return this._client.recordMap;
    }

    private _table!: rt.type_of_record;
    private _id!: rt.string_uuid;

    public get table(): rt.type_of_record {
        return this._table;
    }
    private set table(value: rt.type_of_record) {
        this._table = value!;
    }

    public get record() {
        return this.recordMap.getLocal(this.pointer);
    }

    public get pointer(): rt.pointer_to_record {
        return { table: this.table, id: this.id };
    }

    public get parentPointer(): rt.pointer_to_record | null {
        return getParentPointer(this.record);
    }

    public get id() {
        return this._id;
    }

    public constructor(client: Client, record: rt.record) {
        this._client = client;
        this._id = record.id;
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

    public async set(propertyPath: string[], value: any) {
        this._taskCount++;
        this.markDirty();
        await this._client.setRecordProperty(this, propertyPath, value);
        this._taskCount--;
    }

    public markDirty() {
        this.recordMap.markDirty(this.pointer);
    }

    public get isDirty() {
        return this.recordMap.isDirty(this.pointer);
    }

    public async idle() {
        while (this._taskCount > 0) {
            await new Promise(resolve => setTimeout(resolve, 10));
        }
    }

    public async refresh() {
        await this.recordMap.get(this.pointer, this.isDirty);
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
