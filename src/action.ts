import type * as rt from './record-types';
import type Client from './client.js';
import type Transation from './transaction.js';
import { getBlockTemplate, getCollectionTemplate, getCollectionViewTemplate, getCustomEmojiTemplate, getFileSizeString, getParentPointer, getPointer } from './record-util.js';
import { inferMimeType, newUuid, readFile } from './util.js';
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

    public async done(refreshRecords: boolean = false) {
        await this._transaction.submit(refreshRecords);
    }

    public async setRecordProperty(pointer: rt.pointer, path: string[], args: any) {
        this._transaction.opSet(pointer, path, args);
    }

    public async updateRecordProperty(pointer: rt.pointer, path: string[], args: any) {
        this._transaction.opUpdate(pointer, path, args);
    }

    public async appendSchemaOptions(pointer: rt.pointered<'collection'>, propertyId: rt.string_property_id, options: rt.select_option[]) {
        for (const option of options) {
            this._transaction.opKeyedObjectListAfter(pointer, ['schema', propertyId, 'options'], { value: option });
        }
    }

    public async deleteRecord(pointer: rt.pointer) {
        this._transaction.opUpdate(pointer, [], { alive: false });
        const record = await this._recordMap.get(pointer) as rt.block;
        const parentPointer = getParentPointer(record);
        if (parentPointer) {
            this._transaction.opListRemove(parentPointer, ['content'], { id: pointer.id });
        }
    }

    private async createBlockPlaceholder(type: rt.type_of_block) {
        const record = getBlockTemplate(this._client, type);
        const pointer = getPointer(record, 'block')! as rt.pointered<'block'>;
        this._recordMap.setLocal(pointer, record);
        this._transaction.opSet(pointer, [], record);
        return pointer;
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
        this._transaction.opUpdate(pointer, [], {
            parent_id: parentPointer.id,
            parent_table: parentPointer.table,
        });
    }

    public async createBlock(type: rt.type_of_block, where: 'before' | 'after' | 'child', anchor: rt.pointer) {
        const pointer = await this.createBlockPlaceholder(type);
        switch (where) {
            case 'before': {
                const parentPointer = getParentPointer(await this._recordMap.get(anchor) as rt.block)!;
                await this.setBlockParent(pointer, parentPointer, -1, anchor.id);
                break;
            }
            case 'after': {
                const parentPointer = getParentPointer(await this._recordMap.get(anchor) as rt.block)!;
                await this.setBlockParent(pointer, parentPointer, 1, anchor.id);
                break;
            }
            case 'child': {
                await this.setBlockParent(pointer, anchor);
                break;
            }
        }
        return pointer;
    }

    private async createCollectionViewPlaceholder(type: rt.type_of_collection_view) {
        const record = getCollectionViewTemplate(this._client, type);
        const pointer = getPointer(record, 'collection_view')! as rt.pointered<'collection_view'>;
        this._recordMap.setLocal(pointer, record);
        this._transaction.opSet(pointer, [], record);
        return pointer;
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

    public async createCollectionView(type: rt.type_of_collection_view, parentPointer: rt.pointered<'block'>) {
        const pointer = await this.createCollectionViewPlaceholder(type);
        await this.setCollectionViewParent(pointer, parentPointer);
        return pointer;
    }

    private async createCollectionPlaceholder() {
        const record = getCollectionTemplate(this._client);
        const pointer = getPointer(record, 'collection')! as rt.pointered<'collection'>;
        this._recordMap.setLocal(pointer, record);
        this._transaction.opSet(pointer, [], record);
        return pointer;
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

    public async createCollection(parentPointer: rt.pointered<'block'>) {
        const pointer = await this.createCollectionPlaceholder();
        await this.setCollectionParent(pointer, parentPointer);
        return pointer;
    }

    public async createCustomEmoji(name: string, url: rt.string_url) {
        const record = getCustomEmojiTemplate(this._client, name, url);
        const pointer = getPointer(record, 'custom_emoji')! as rt.pointered<'custom_emoji'>;
        this._recordMap.setLocal(pointer, record);
        this._transaction.opSet(pointer, [], record);
        return pointer;
    }

    public async updateFile(pointer: rt.pointered<'block'>, filePath: string, blob?: Blob, propertyId?: rt.string_property_id) {
        if (!blob) {
            const buffer = await readFile(filePath);
            blob = new Blob([buffer]);
        }
        const name = filePath.split(/[\\/]/).pop()!;
        const contentType = inferMimeType(name);
        const contentLength = blob.size;
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

    public async updateFilePublic(filePath: string, blob?: Blob) {
        if (!blob) {
            const buffer = await readFile(filePath);
            blob = new Blob([buffer]);
        }
        const name = filePath.split(/[\\/]/).pop()!;
        const contentType = inferMimeType(name);
        const contentLength = blob.size;
        const data = await this._client.sessionApi.getUploadFileUrl({ name, contentType, contentLength });
        const awsSession = this._client.awsSession;
        await awsSession.awsUploadFile(data, blob);
        return data.url as rt.string_url;
    }

}
