import type * as rt from './record-types';
import Record, { as_record, record_accessor, readonly_record_accessor } from './record.js';
import { decodeProperty, dp, encodeProperty, ep } from './converter.js';
import Collection from './collection.js';
import log from './log.js';

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

    @readonly_record_accessor('format.collection_pointer')
    public accessor collectionPointer!: rt.pointered<'collection'>;

    async getCollection() {
        var record = this.record as rt.block_collection_view;
        var collectionPointer = (record as any).format.collection_pointer;
        var collectionRecord = await this.recordMap.get(collectionPointer);
        return Record.wrap(this._client, collectionRecord, 'collection') as Collection;
    }

}
