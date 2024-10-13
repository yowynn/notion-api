import { Client } from './client.js';
import { date2timestamp, timestamp2date } from './converter.js';
import { ReadonlyModificationError, UnsupportedError } from './error.js';
import * as types from './record-types.js';


export class record {
    protected _record: types.record;
    protected _client: Client;

    protected get recordMap() {
        return this._client.recordMap;
    }

    public get table(): types.collection_record_type | null {
        return null;
    }

    public get record() {
        return this._record;
    }
    public get id() {
        return this.record.id;
    }

    public constructor(client: Client, record: types.record) {

        this._client = client;
        this._record = record;
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
        await this.recordMap.set_block_property(this.id, record_path, value);
    }
}

export function record_accessor(path?: string, getter: ((x: any) => any) = x => x, setter: ((x: any) => any) | null = x => x) {
    return function ({ get, set }: ClassAccessorDecoratorTarget<record, any>, { kind, name }: ClassAccessorDecoratorContext<record, any>) {
        if (kind === 'accessor') {
            path = path || name as string;
            const record_path = (path as string).split('.');
            return {
                get(this: record) {
                    const data = this.get(...record_path);
                    return getter(data);
                },
                async set(this: record, value: any) {
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
