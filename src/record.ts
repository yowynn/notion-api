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
    private _dirty = false;

    protected _record: rt.record;
    protected _client: Client;

    protected get recordMap() {
        return this._client.recordMap;
    }

    private _table!: rt.type_of_record;

    public get table(): rt.type_of_record {
        return this._table;
    }
    private set table(value: rt.type_of_record) {
        this._table = value!;
    }

    public get record() {
        return this._record;
    }

    public get pointer(): rt.pointer_to_record {
        return getPointer(this.record, this.table as rt.type_of_record)!;
    }

    public get parentPointer(): rt.pointer_to_record | null {
        return getParentPointer(this.record);
    }

    public get id() {
        return this.record.id;
    }

    public constructor(client: Client, record: rt.record) {
        this._client = client;
        this._record = record;
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
        let record = this.record as any;
        for (let p of propertyPath.slice(0, -1)) {
            if (!record[p]) {
                record[p] = {};
            }
            record = record[p];
        }
        record[propertyPath.slice(-1)[0]] = value;
        this._taskCount++;
        await this._client.setRecordProperty(this, propertyPath, value);
        this._taskCount--;
        this._dirty = true;
    }

    public async refresh() {
        while (this._taskCount > 0) {
            await new Promise(resolve => setTimeout(resolve, 10));
        }
        this._record = await this.recordMap.get(this.pointer, this._dirty) ?? this._record;
        this._dirty = false;
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
