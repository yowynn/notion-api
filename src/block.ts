import type * as rt from './record-types.js';
import Record, { as_record, record_accessor, readonly_record_accessor } from './record.js';
import { markdown2richtext, richtext2markdown } from './converter.js';

@as_record('block')
export default class Block extends Record {
    public get table() {
        return 'block' as rt.collection_record_type;
    }

    @record_accessor('alive')
    public accessor alive!: boolean;

    @record_accessor('type')
    public accessor type!: string;

    @record_accessor('properties.title', richtext2markdown, markdown2richtext)
    public accessor title!: string;

    @readonly_record_accessor('content', (x) => (x as any[] ?? []).length)
    public accessor childCount!: number;

    public async getParent<T = Record>() {
        var record = this.record as rt.record_block
        var parentRecord = await this.recordMap.get(record.parent_table, record.parent_id);
        return Record.create(this._client, parentRecord, record.parent_table) as T;
    }

    public async getChild<T = Block>(index: number) {
        var record = this.record as any
        var childId = record.content?.[index];
        if (!childId) {
            return undefined as unknown as T;
        }
        var childRecord = await this.recordMap.get('block', childId);
        return Record.create(this._client, childRecord, 'block') as T;
    }
}

@as_record('block', 'text')
export class TextBlock extends Block { }
