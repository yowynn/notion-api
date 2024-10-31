import type * as rt from './record-types';
import Record, { as_record, record_accessor, readonly_record_accessor } from './record.js';
import { decodeProperty, dp, encodeProperty, ep } from './converter.js';
import Collection from './collection.js';
import log from './log.js';
import Block, { CollectionViewBlock } from './block.js';

@as_record('collection_view')
export default class CollectionView extends Record {
    public get table() {
        return 'collection_view' as rt.type_of_record;
    }

    @record_accessor('type')
    public accessor type!: rt.type_of_collection_view;

    @record_accessor('name')
    public accessor title!: string;

    @record_accessor('format.description')
    public accessor description!: string;

    @record_accessor('format.collection_view_icon')
    public accessor icon!: rt.string_icon;

    public async getParent<T = Block>() {
        var record = this.record as rt.i_parented;
        var parentRecord = await this.recordMap.get(this.parentPointer!);
        return Record.wrap(this._client, parentRecord, record.parent_table) as T;
    }

    @readonly_record_accessor('format.collection_pointer')
    public accessor collectionPointer!: rt.pointered<'collection'>;

    async getCollection() {
        var collectionPointer = (this.record as any).format.collection_pointer;
        if (collectionPointer) {
            var collectionRecord = await this.recordMap.get(collectionPointer);
            return Record.wrap(this._client, collectionRecord, 'collection') as Collection;
        }
        else {
            const parent = await this.getParent<CollectionViewBlock>();
            const collection = await parent.getCollection();
            return collection;
        }

    }

}
