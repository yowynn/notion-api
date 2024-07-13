import { ReadonlyModificationError, UnsupportedError } from './error.js';
import { RecordMap } from './record-map.js';
import { timestamp2date } from './util.js';

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
    accessor version!: number;

    @readonly_record_accessor('created_time', timestamp2date)
    accessor created_time!: number;
    @readonly_record_accessor('last_edited_time', timestamp2date)
    accessor last_edited_time!: number;


}

export function record_accessor(path?: string, getter: ((x: any) => any) = (x: any) => x, setter: ((x: any) => any) | null = (x: any) => x) {
    return function ({ get, set }: ClassAccessorDecoratorTarget<recordable, any>, { kind, name }: ClassAccessorDecoratorContext<recordable, any>) {
        if (kind === "accessor") {
            path = path || name as string;
            const paths = (path as string).split(".");
            return {
                get(this: recordable) {
                    let record = this.record as any;
                    for (let p of paths) {
                        record = record[p];
                    }
                    return getter(record);
                },
                async set(this: recordable, value: any) {
                    if (setter === null) {
                        throw new ReadonlyModificationError("record_accessor", path as string);
                    }
                    let record = this.record as any;
                    for (let p of paths.slice(0, -1)) {
                        record = record[p];
                    }
                    record[paths.slice(-1)[0]] = setter(value);
                },
            } as any;
        }
        else {
            throw new UnsupportedError("record_accessor", kind);
        }
    };
}

export function readonly_record_accessor(path?: string, getter = (x: any) => x) {
    return record_accessor(path, getter, null);
}


