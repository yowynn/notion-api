import type * as rt from './record-types';
import type Client from './client.js';
import type Transation from './transaction.js';
import { getBlockTemplate, getCollectionTemplate, getCollectionViewTemplate, getCustomEmojiTemplate, getFileSizeString, getParentPointer, getPointer } from './record-util.js';
import { inferMimeType, readFile } from './util.js';
import log from './log.js';

export default class Action {

    private _client: Client;

    private get _transaction(): Transation {
        return this._client.transaction;
    }

    private get _recordMap() {
        return this._client.recordMap;
    }

    public constructor(client: Client) {
        this._client = client;
    }

    public async done(refreshRecords: boolean = true) {
        await this._transaction.submit(refreshRecords);
    }

    public async updateField(pointer: rt.pointer, path: string[], args: any, isDelta: boolean = false) {
        if (isDelta) {
            this._transaction.opUpdate(pointer, path, args);
        }
        else {
            this._transaction.opSet(pointer, path, args);
        }
    }

    public async appendSchemaOptions(pointer: rt.pointered<'collection'>, propertyId: rt.string_property_id, optionList: rt.select_option[]) {
        for (const option of optionList) {
            this._transaction.opKeyedObjectListAfter(pointer, ['schema', propertyId, 'options'], { value: option });
        }
    }

    public async appendRelations(pointer: rt.pointered<'block'>, propertyId: rt.string_property_id, relatedPointerList: rt.pointered<'block'>[]) {
        const record = await this._recordMap.get(pointer) as rt.block;
        if (record.parent_table !== 'collection') {
            throw new Error('Parent table is not collection');
        }
        const collection = await this._recordMap.get({ id: record.parent_id, table: 'collection' }) as rt.collection;
        const schema = collection.schema[propertyId] as rt.schema_relation;
        const relatedPropertyId = schema.property;
        const isBidirectionalLink = relatedPropertyId && relatedPropertyId !== propertyId;
        for (const relatedPointer of relatedPointerList) {
            this._transaction.opAddRelationAfter(pointer, ['properties', propertyId], { id: relatedPointer.id, spaceId: relatedPointer.spaceId });
            if (isBidirectionalLink) {
                this._transaction.opAddRelationAfter(relatedPointer, ['properties', relatedPropertyId], { id: pointer.id, spaceId: pointer.spaceId });
            }
        }
    }

    public async delete(pointer: rt.pointer) {
        this._transaction.opUpdate(pointer, [], { alive: false });
        const record = await this._recordMap.get(pointer) as rt.block;
        const parentPointer = getParentPointer(record);
        if (parentPointer) {
            if (parentPointer.table === 'block') {
                if (record.type === 'collection_view') {
                    this._transaction.opListRemove(parentPointer, ['view_ids'], { id: pointer.id });
                }
                else {
                    this._transaction.opListRemove(parentPointer, ['content'], { id: pointer.id });
                }
            }
            else {
                throw new Error(`Unsupported parent table: ${parentPointer.table}`);
            }
        }
    }

    public async deleteBlocks(pointerList: rt.pointered<'block'>[], permanentlyDelete: boolean = false) {
        this._client.sessionApi.deleteBlocks(pointerList, permanentlyDelete);
    }

    public async setBlockParent(pointer: rt.pointered<'block'>, parentPointer: rt.pointer, index: number = -1, anchorId?: rt.string_uuid) {
        const record = await this._recordMap.get(pointer) as rt.block;
        const oldParentPointer = getParentPointer(record);
        if (oldParentPointer) {
            switch (oldParentPointer.table) {
                case 'block': {
                    this._transaction.opListRemove(oldParentPointer, ['content'], { id: pointer.id });
                    break;
                }
                case 'collection': {
                    // nothing to do
                    break;
                }
                default: {
                    throw new Error(`Unsupported parent table: ${oldParentPointer.table}`);
                }
            }
        }
        switch (parentPointer.table) {
            case 'block': {
                if (anchorId) {
                    if (index === -1) {
                        // before the anchor
                        this._transaction.opListBefore(parentPointer, ['content'], { id: pointer.id, before: anchorId });
                    }
                    else if (index === 1) {
                        // after the anchor
                        this._transaction.opListAfter(parentPointer, ['content'], { id: pointer.id, after: anchorId });
                    }
                    else {
                        throw new Error(`Unsupported index: ${index}`);
                    }
                }
                else {
                    if (index === -1) {
                        // at the tail of the list
                        this._transaction.opListAfter(parentPointer, ['content'], { id: pointer.id });
                    }
                    else if (index === 0) {
                        // at the head of the list
                        this._transaction.opListBefore(parentPointer, ['content'], { id: pointer.id });
                    }
                    else if (index > 0) {
                        const parent = await this._recordMap.get(parentPointer) as any;
                        anchorId = parent.content?.[index];
                        this._transaction.opListBefore(parentPointer, ['content'], { id: pointer.id, before: anchorId });
                    }
                    else {
                        const parent = await this._recordMap.get(parentPointer) as any;
                        anchorId = parent.content ? parent.content[parent.content.length + index] : undefined;
                        this._transaction.opListAfter(parentPointer, ['content'], { id: pointer.id, after: anchorId });
                    }
                }
                break;
            }
            case 'collection': {
                this._transaction.opSetParent(pointer, [], { parentId: parentPointer.id, parentTable: parentPointer.table });
                break;
            }
            default: {
                throw new Error(`Unsupported parent table: ${parentPointer.table}`);
            }
        }
        record.parent_id = parentPointer.id;
        record.parent_table = parentPointer.table;
        this._transaction.opUpdate(pointer, [], {
            parent_id: parentPointer.id,
            parent_table: parentPointer.table,
        });
    }

    public async setCollectionViewParent(pointer: rt.pointered<'collection_view'>, parentPointer: rt.pointered<'block'>) {
        const record = await this._recordMap.get(pointer) as rt.collection_view;
        const oldParentPointer = getParentPointer(record);
        if (oldParentPointer) {
            this._transaction.opListRemove(oldParentPointer, ['view_ids'], { id: pointer.id });
        }
        this._transaction.opUpdate(pointer, [], {
            parent_id: parentPointer.id,
            parent_table: parentPointer.table,
        });
        this._transaction.opListAfter(parentPointer, ['view_ids'], { id: pointer.id });
    }

    public async setCollectionParent(pointer: rt.pointered<'collection'>, parentPointer: rt.pointered<'block'>) {
        const record = await this._recordMap.get(pointer) as rt.collection;
        const oldParentPointer = getParentPointer(record);
        if (oldParentPointer) {
            this._transaction.opUpdate(oldParentPointer, [], { collection_id: null });
            this._transaction.opUpdate(oldParentPointer, [ 'format' ], { collection_pointer: null });
        }
        this._transaction.opUpdate(pointer, [], {
            parent_id: parentPointer.id,
            parent_table: parentPointer.table,
        });
        this._transaction.opUpdate(parentPointer, [], { collection_id: pointer.id });
        this._transaction.opUpdate(parentPointer, [ 'format' ], { collection_pointer: pointer });
    }

    public async linkViewToCollection(pointer: rt.pointered<'collection_view'>, collectionPointer: rt.pointered<'collection'>) {
        this._transaction.opUpdate(pointer, [ 'format' ], { collection_pointer: collectionPointer });
    }

    public async createBlock(type: rt.type_of_block, where: 'before' | 'after' | 'child', anchoredPointer: rt.pointer) {
        const record = getBlockTemplate(this._client, type);
        const pointer = getPointer(record, 'block')! as rt.pointered<'block'>;
        const deepCopy = JSON.parse(JSON.stringify(record));
        this._recordMap.setLocal(pointer, deepCopy);
        this._transaction.opSet(pointer, [], record);
        switch (where) {
            case 'before': {
                const parentPointer = getParentPointer(await this._recordMap.get(anchoredPointer) as rt.block)!;
                await this.setBlockParent(pointer, parentPointer, -1, anchoredPointer.id);
                break;
            }
            case 'after': {
                const parentPointer = getParentPointer(await this._recordMap.get(anchoredPointer) as rt.block)!;
                await this.setBlockParent(pointer, parentPointer, 1, anchoredPointer.id);
                break;
            }
            case 'child': {
                await this.setBlockParent(pointer, anchoredPointer);
                break;
            }
        }
        return pointer;
    }

    public async createCollectionView(type: rt.type_of_collection_view, parentPointer: rt.pointered<'block'>) {
        const record = getCollectionViewTemplate(this._client, type);
        const pointer = getPointer(record, 'collection_view')! as rt.pointered<'collection_view'>;
        const deepCopy = JSON.parse(JSON.stringify(record));
        this._recordMap.setLocal(pointer, deepCopy);
        this._transaction.opSet(pointer, [], record);
        await this.setCollectionViewParent(pointer, parentPointer);
        return pointer;
    }

    public async createCollection(parentPointer: rt.pointered<'block'>, linkedViewPointer: rt.pointered<'collection_view'>) {
        const record = getCollectionTemplate(this._client);
        const pointer = getPointer(record, 'collection')! as rt.pointered<'collection'>;
        const deepCopy = JSON.parse(JSON.stringify(record));
        this._recordMap.setLocal(pointer, deepCopy);
        this._transaction.opSet(pointer, [], record);
        await this.setCollectionParent(pointer, parentPointer);
        if (linkedViewPointer) {
            await this.linkViewToCollection(linkedViewPointer, pointer);
        }
        return pointer;
    }

    public async createCustomEmoji(name: string, url: rt.string_url) {
        const record = getCustomEmojiTemplate(this._client, name, url);
        const pointer = getPointer(record, 'custom_emoji')! as rt.pointered<'custom_emoji'>;
        const deepCopy = JSON.parse(JSON.stringify(record));
        this._recordMap.setLocal(pointer, deepCopy);
        this._transaction.opSet(pointer, [], record);
        return pointer;
    }

    private async loadFile(uri: string, blob?: Blob) {
        const isUrl = uri.startsWith('http://') || uri.startsWith('https://');
        let name: string;
        let contentType: string;
        let contentLength: number;
        if (!blob) {
            if (isUrl) {
                const response = await fetch(uri);
                blob = await response.blob();
                contentType = response.headers.get('content-type')!;
                contentLength = parseInt(response.headers.get('content-length')!);
                name = uri.split('?')[0].split('#')[0].split(/[\\/]/).pop()!;
            }
            else {
                const buffer = await readFile(uri);
                blob = new Blob([buffer]);
                name = uri.split(/[\\/]/).pop()!;
                contentType = inferMimeType(name);
                contentLength = blob.size;
            }
        }
        name = name! ?? uri.split('?')[0].split('#')[0].split(/[\\/]/).pop()!;
        contentType = contentType! ?? inferMimeType(name);
        contentLength = contentLength! ?? blob.size;
        return { name, contentType, contentLength, blob };
    }

    public async uploadFile(pointer: rt.pointered<'block'>, uri: string, fileBlob?: Blob, propertyId?: rt.string_property_id) {
        const { name, contentType, contentLength, blob } = await this.loadFile(uri, fileBlob);
        const data = await this._client.sessionApi.getUploadFileUrl({ name, contentType, contentLength }, pointer);
        const awsSession = this._client.awsSession;
        await awsSession.awsUploadFile(data, blob);
        if (propertyId) {
            this._transaction.opSet(pointer, ['properties', propertyId], [[name, [['a', data.url]]]] as [string, [rt.annotation_link]][]);
        }
        else {
            this._transaction.opUpdate(pointer, ['properties'], {
                size: [[getFileSizeString(contentLength)]],
                source: [[data.url]],
                title: [[name]],
            });
            this._transaction.opUpdate(pointer, ['format'], {
                display_source: data.url,
            });
        }
        return data.url as rt.string_url;
    }

    public async uploadFilePublic(uri: string, fileBlob?: Blob) {
        const { name, contentType, contentLength, blob } = await this.loadFile(uri, fileBlob);
        const data = await this._client.sessionApi.getUploadFileUrl({ name, contentType, contentLength });
        const awsSession = this._client.awsSession;
        await awsSession.awsUploadFile(data, blob);
        return data.url as rt.string_url;
    }

}
