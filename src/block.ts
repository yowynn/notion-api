import type * as rt from './record-types.js';
import Record, { as_record, record_accessor, readonly_record_accessor } from './record.js';
import { markdown2richtext, richtext2markdown } from './converter.js';

@as_record('block')
export default class Block extends Record {
    public get table() {
        return 'block' as rt.collection_record_type;
    }

    @readonly_record_accessor('alive')
    public accessor inTrash!: boolean;

    @record_accessor('type')
    public accessor type!: rt.collection_block_type;

    @record_accessor('properties.title', richtext2markdown, markdown2richtext)
    public accessor title!: string;

    @record_accessor('format.block_color')
    public accessor blockColor!: rt.option_highlight_color;


    @readonly_record_accessor('content', (x) => (x as any[] ?? []).length)
    public accessor childCount!: number;

    public async getParent<T = Record>() {
        var record = this.record as rt.record_block
        var parentRecord = await this.recordMap.get({ table: record.parent_table, id: record.parent_id, spaceId: record.space_id });
        return Record.wrap(this._client, parentRecord, record.parent_table) as T;
    }

    public async getChild<T = Block>(index: number) {
        var record = this.record as any
        var childId = record.content?.[index];
        if (!childId) {
            return undefined as unknown as T;
        }
        var childRecord = await this.recordMap.get({ table: 'block', id: childId, spaceId: record.space_id });
        return Record.wrap(this._client, childRecord, 'block') as T;
    }

    public async getChildren<T = Block>() {
        var record = this.record as any
        var content: rt.literal_uuid[] = record.content ?? [];
        var children = await this.recordMap.getList(content.map(id => ({ table: 'block', id })));
        return children.map(child => Record.wrap(this._client, child, 'block') as T);
    }

    public async delete() {
        await this._client.action.deleteRecord({ table: 'block', id: this.id});
    }
}

@as_record('block', 'text')
export class TextBlock extends Block { }
