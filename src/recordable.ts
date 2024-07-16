import { date2timestamp, timestamp2date } from './converter.js';
import { ReadonlyModificationError, UnsupportedError } from './error.js';
import { RecordMap } from './record-map.js';

export class recordable {
    protected _id: string;
    protected _recordMap: RecordMap;
    public get record() {
        return this._recordMap.get_record_cache('block', this._id);
    }
    public get id() {
        return this._id;
    }
    public constructor(id: string, recordMap: RecordMap) {
        this._id = id;
        this._recordMap = recordMap;
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
            record = record[p];
        }
        record[record_path.slice(-1)[0]] = value;
        await this._recordMap.request_submit_transaction_set_record_values(this._id, record_path, value);
    }
}

export function record_accessor(path?: string, getter: ((x: any) => any) = (x: any) => x, setter: ((x: any) => any) | null = (x: any) => x) {
    return function ({ get, set }: ClassAccessorDecoratorTarget<recordable, any>, { kind, name }: ClassAccessorDecoratorContext<recordable, any>) {
        if (kind === 'accessor') {
            path = path || name as string;
            const record_path = (path as string).split('.');
            return {
                get(this: recordable) {
                    const data = this.get(...record_path);
                    return getter(data);
                },
                async set(this: recordable, value: any) {
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


