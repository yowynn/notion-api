import type * as rt from './record-types';
import type Collection from './collection.js';
import type { CollectionViewBlock, CollectionViewPageBlock } from './block.js';
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

    public async getParent<T extends CollectionViewBlock | CollectionViewPageBlock = CollectionViewBlock>() {
        const parentPointer = this.parentPointer;
        if (!parentPointer) {
            return undefined as unknown as T;
        }
        var parentRecord = await this.recordMap.get(parentPointer);
        return Record.wrap(this.client, parentRecord, parentPointer.table) as T;
    }

    @readonly_record_accessor('format.collection_pointer')
    public accessor cachedCollectionPointer!: rt.pointered<'collection'>;

    async getCollection() {
        var collectionPointer = this.cachedCollectionPointer ?? ((await this.getParent()).collectionPointer);
        if (collectionPointer) {
            var collectionRecord = await this.recordMap.get(collectionPointer);
            return Record.wrap(this._client, collectionRecord, collectionPointer.table) as Collection;
        }
        return undefined as unknown as Collection;
    }

}
