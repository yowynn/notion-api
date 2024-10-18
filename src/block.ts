import type * as rt from './record-types.js';
import Record, { as_record, record_accessor, readonly_record_accessor } from './record.js';
import { markdown2richtext, richtext2markdown } from './converter.js';

@as_record
export default class block extends Record {
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
    public accessor child_count!: number;

    public async get_parent<T = Record>() {
        var current_record = this.record as rt.record_block
        var parent_record = await this.record_map.get(current_record.parent_table, current_record.parent_id);
        return Record.new_record(this._client, parent_record, current_record.parent_table) as T;
    }

    public async get_child<T = block>(index: number) {
        var current_record = this.record as any
        var child_id = current_record.content?.[index];
        if (!child_id) {
            return undefined as unknown as T;
        }
        var child_record = await this.record_map.get('block', child_id);
        return Record.new_record(this._client, child_record, 'block') as T;
    }
}
