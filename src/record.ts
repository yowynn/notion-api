import type * as rt from './record-types.js';
import type Client from './client.js';
import { date2timestamp, timestamp2date } from './converter.js';
import { DuplicateKeyError, ReadonlyModificationError, UnsupportedError } from './error.js';
import log from './log.js';

const recordTypeMap: { [key: string]: new (client: any, record: any) => Record; } = {};

@as_record()
export default class Record {
    static wrap(client: Client, record: rt.record, table: rt.collection_record_type = 'block') {
        const type = (record as any).type;
        let key = table;
        if (type) {
            key = key + '.' + type;
        }
        const ctor = recordTypeMap[key] ?? recordTypeMap[table] ?? recordTypeMap.record;
        return new ctor(client, record);
    }

    private _taskCount = 0;

    protected _record: rt.record;
    protected _client: Client;

    protected get recordMap() {
        return this._client.recordMap;
    }

    public get table(): rt.collection_record_type | null {
        return null;
    }

    public get record() {
        return this._record;
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

    public get(...propertyPath: string[]) {
        let record = this.record as any;
        for (let p of propertyPath) {
            record = record?.[p];
        }
        return record;
    }

    public async set(value: any, ...propertyPath: string[]) {
        let record = this.record as any;
        for (let p of propertyPath.slice(0, -1)) {
            if (!record[p]) {
                record[p] = {};
            }
            record = record[p];
        }
        record[propertyPath.slice(-1)[0]] = value;
        this._taskCount++;
        await this._client.action.setRecordProperty({ table: 'block', id: this.id }, propertyPath, value);
        this._taskCount--;
    }

    public async refresh(update = false) {
        while (this._taskCount > 0) {
            await new Promise(resolve => setTimeout(resolve, 10));
        }
        this._record = await this.recordMap.get({ table: this.table as rt.collection_record_type, id: this.id }) ?? this._record;
    }
}

export function record_accessor(path?: string, getter: ((x: any) => any) = x => x, setter: ((x: any) => any) | null = x => x) {
    return function ({ get, set }: ClassAccessorDecoratorTarget<Record, any>, { kind, name }: ClassAccessorDecoratorContext<Record, any>) {
        if (kind === 'accessor') {
            path = path || name as string;
            const propertyPath = (path as string).split('.');
            return {
                get(this: Record) {
                    const data = this.get(...propertyPath);
                    return getter(data);
                },
                async set(this: Record, value: any) {
                    if (setter === null) {
                        throw new ReadonlyModificationError('record_accessor', path as string);
                    }
                    const data = setter(value);
                    await this.set(data, ...propertyPath);
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

export function as_record(table: rt.collection_record_type | 'record' = 'record', type: string = '') {
    const addToRecordTypeMap = (ctor: new (client: any, record: any) => Record) => {
        let key = table as string;
        if (type) {
            key = key + '.' + type;
        }
        if (recordTypeMap[key]) {
            throw new DuplicateKeyError('addToRecordTypeMap', key);
        }
        recordTypeMap[key] = ctor;
        console.log('reg record type:', key, ctor)
    }
    return addToRecordTypeMap;
}
