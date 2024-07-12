import { RecordMap } from './record-map.js';
import { recordable } from './recordable.js';

export class block extends recordable {

}

export class page_block {
    protected _id: string;
    protected _recordMap: RecordMap;
    public get id() {
        return this._id;
    }
    public get recordMap() {
        return this._recordMap;
    }
    public get record() {
        return this.recordMap.get_record('block', this.id);
    }

    public constructor(id: string, recordMap: RecordMap) {
        this._id = id;
        this._recordMap = recordMap;
    }

    public func1() { }
    static func2() { }

    aa = 3;
}
