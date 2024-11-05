import type * as rt from './record-types';
import type Collection from './collection.js';
import type { CollectionViewBlock, CollectionViewPageBlock, PageBlock } from './block.js';
import Record, { as_record, record_accessor, readonly_record_accessor } from './record.js';
import log from './log.js';

@as_record('collection_view')
export default class CollectionView extends Record {
    public override get table() {
        return 'collection_view' as 'collection_view';
    }

    public override get record(): rt.collection_view {
        return super.record as rt.collection_view;
    }

    public override get pointer(): rt.pointered<'collection_view'> {
        return super.pointer as rt.pointered<'collection_view'>;
    }

    @record_accessor('type')
    public accessor type!: rt.type_of_collection_view;

    @record_accessor('name')
    public accessor title!: string;

    @record_accessor('format.description')
    public accessor description!: string;

    @record_accessor('format.collection_view_icon')
    public accessor icon!: rt.string_icon;

    @readonly_record_accessor('format.collection_pointer')
    public accessor cachedCollectionPointer!: rt.pointered<'collection'>;

    public async getParent<T extends CollectionViewBlock | CollectionViewPageBlock = CollectionViewBlock>() {
        const parentPointer = this.parentPointer;
        if (!parentPointer) {
            return undefined as unknown as T;
        }
        await this.recordMap.get(parentPointer);
        return Record.wrap(this.client, parentPointer) as T;
    }

    async getCollection() {
        var collectionPointer = this.cachedCollectionPointer ?? ((await this.getParent()).collectionPointer);
        if (collectionPointer) {
            await this.recordMap.get(collectionPointer);
            return Record.wrap(this.client, collectionPointer) as Collection;
        }
        return undefined as unknown as Collection;
    }

    public async clearAllRecords(permanentlyDelete: boolean = false) {
        const pointerList = await this.getRecordPointers();
        await this.client.action.deleteBlocks(pointerList, permanentlyDelete);
        await this.client.action.done(true);
    }

    public async queryRecords(options: rt.collection_query_options = {}) {
        const record = this.record;
        const collectionPointer = (await this.getCollection()).pointer;
        const collectionViewPointer = this.pointer;
        const idList = await this.recordMap.getQueryedResult(collectionPointer, collectionViewPointer, options, 'query') as rt.string_uuid[];
        const blockList = idList.map(id => Record.wrap(this.client, { id, table: 'block', spaceId: record.space_id })) as PageBlock[];
        return blockList;
    }

    public async getTemplatePointers() {
        return (await this.getCollection()).getTemplatePointers();
    }

    public async getRecordPointers(includeTemplate: boolean = false) {
        const record = this.record;
        const collection = await this.getCollection();
        const collectionPointer = collection.pointer;
        const collectionViewPointer = this.pointer;
        let idList = await this.recordMap.getQueryedResult(collectionPointer, collectionViewPointer, { limit: 1 }, 'all') as rt.string_uuid[];
        if (!includeTemplate) {
            const templateList = collection.record.template_pages ?? [];
            idList = idList.filter(id => !templateList.includes(id));
        }
        const pointerList: rt.pointered<'block'>[] = idList.map(id => ({ table: 'block', id, spaceId: record.space_id }));
        return pointerList;
    }

    public async getRecordCount(includeTemplate: boolean = false) {
        const collection = await this.getCollection();
        const collectionPointer = collection.pointer;
        const collectionViewPointer = this.pointer;
        let count = await this.recordMap.getQueryedResult(collectionPointer, collectionViewPointer, { limit: 1 }, 'count') as number;
        if (includeTemplate) {
            count += (collection.record.template_pages ?? []).length;
        }
        return count;
    }
}
