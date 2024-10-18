import type * as rt from './record-types.js';
import type Client from './client.js';
import { date2timestamp, timestamp2date } from './converter.js';
import { ReadonlyModificationError, UnsupportedError } from './error.js';

const record_type_map: { [key: string]: new (client: any, record: any) => Record; } = {};

@as_record
export default class Record {
    static new_record(client: Client, record: rt.record, table: rt.collection_record_type = 'block') {
        const type = (record as any).type;
        let type_key = table;
        if (type) {
            type_key = type_key + '_' + type;
        }
        const ctor = record_type_map[type_key] ?? record_type_map[table] ?? record_type_map.record;
        return new ctor(client, record);
    }

    protected _record: rt.record;
    protected _client: Client;

    protected get record_map() {
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

    public async refresh(update = false) {
        this._record = await this.record_map.get(this.table as rt.collection_record_type, this.id, update) ?? this._record;
    }

    @readonly_record_accessor('version')
    public accessor version!: number;

    @record_accessor('created_time', timestamp2date, date2timestamp)
    public accessor created_time!: Date;

    @record_accessor('last_edited_time', timestamp2date, date2timestamp)
    public accessor last_edited_time!: Date;

    public get(...record_path: string[]) {
        let record = this.record as any;
        for (let p of record_path) {
            record = record?.[p];
        }
        return record;
    }

    public async set(value: any, ...record_path: string[]) {
        let record = this.record as any;
        for (let p of record_path.slice(0, -1)) {
            if (!record[p]) {
                record[p] = {};
            }
            record = record[p];
        }
        record[record_path.slice(-1)[0]] = value;
        await this._client.action.setRecordProperty('block', this.id, record_path, value);
    }
}

export function record_accessor(path?: string, getter: ((x: any) => any) = x => x, setter: ((x: any) => any) | null = x => x) {
    return function ({ get, set }: ClassAccessorDecoratorTarget<Record, any>, { kind, name }: ClassAccessorDecoratorContext<Record, any>) {
        if (kind === 'accessor') {
            path = path || name as string;
            const record_path = (path as string).split('.');
            return {
                get(this: Record) {
                    const data = this.get(...record_path);
                    return getter(data);
                },
                async set(this: Record, value: any) {
                    if (setter === null) {
                        throw new ReadonlyModificationError('record_accessor', path as string);
                    }
                    const data = setter(value);
                    await this.set(data, ...record_path);
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

export function as_record(ctor: new (client: any, record: any) => Record) {
    record_type_map[ctor.name] = ctor;
}
