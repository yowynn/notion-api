import type * as rt from './record-types';
import type Client from './client.js';
import type Transation from './transaction.js';
import { getBlockTemplate, getCollectionTemplate, getCollectionViewTemplate, getFileSizeString, getParentPointer, getPointer } from './record-util.js';
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

    public async setRecordProperty(pointer: rt.pointer_to_record, path: string[], args: any) {
        this._transaction.opSet(pointer, path, args);
    }

    public async deleteRecord(pointer: rt.pointer_to_record) {
        this._transaction.opUpdate(pointer, [], { alive: false });
        const record = await this._recordMap.get(pointer) as rt.block;
        const parentPointer = getParentPointer(record);
        if (parentPointer) {
            this._transaction.opListRemove(parentPointer, ['content'], { id: pointer.id });
        }
    }

    private async createBlockPlaceholder(type: rt.type_of_block) {
        const record = getBlockTemplate(type, this._client.userId);
        const pointer = getPointer(record, 'block')!;
        this._recordMap.setLocal(pointer, record);
        this._transaction.opSet(pointer, [], record);
        return pointer;
    }

    public async setBlockParent(pointer: rt.pointer_to_record, parentPointer: rt.pointer_to_record, index: number = -1, anchorId?: rt.string_uuid) {
        const record = await this._recordMap.get(pointer) as rt.block;
        const oldParentPointer = getParentPointer(record);
        if (oldParentPointer) {
            this._transaction.opListRemove(oldParentPointer, ['content'], { id: pointer.id });
        }
        this._transaction.opUpdate(pointer, [], {
            parent_id: parentPointer.id,
            parent_table: parentPointer.table,
        });
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
    }

    public async createBlock(type: rt.type_of_block, where: 'before' | 'after' | 'child', anchor: rt.pointer_to_record) {
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
        const record = getCollectionViewTemplate(type, this._client.userId);
        const pointer = getPointer(record, 'collection_view')!;
        this._recordMap.setLocal(pointer, record);
        this._transaction.opSet(pointer, [], record);
        return pointer;
    }

    public async setCollectionViewParent(pointer: rt.pointer_to_record, parentPointer: rt.pointer_to_record) {
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

    public async createCollectionView(type: rt.type_of_collection_view, parent: rt.pointer_to_record) {
        const pointer = await this.createCollectionViewPlaceholder(type);
        await this.setCollectionViewParent(pointer, parent);
        return pointer;
    }

    private async createCollectionPlaceholder() {
        const record = getCollectionTemplate();
        const pointer = getPointer(record, 'collection')!;
        this._recordMap.setLocal(pointer, record);
        this._transaction.opSet(pointer, [], record);
        return pointer;
    }

    public async setCollectionParent(pointer: rt.pointer_to_record, parentPointer: rt.pointer_to_record) {
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

    public async createCollection(parent: rt.pointer_to_record) {
        const pointer = await this.createCollectionPlaceholder();
        await this.setCollectionParent(pointer, parent);
        return pointer;
    }

    public async updateFile(pointer: rt.pointer_to_record, filePath: string, blob?: Blob) {
        if (!blob) {
            const buffer = readFile(filePath);
            blob = new Blob([buffer]);
        }
        const name = filePath.split(/[\\/]/).pop()!;
        const contentType = inferMimeType(name);
        const contentLength = blob.size;
        const data = await this._client.sessionApi.getUploadFileUrl(pointer, { name, contentType, contentLength });
        const awsSession = this._client.awsSession;
        data.postHeaders?.forEach((header: any) => awsSession.headers.set(header.name, header.value));
        await awsSession.awsUploadFile(data.fields, blob);
        this._transaction.opUpdate(pointer, ['properties'], {
            size: [[getFileSizeString(contentLength)]],
            source: [[data.url]],
            title: [[name]],
        });
        this._transaction.opUpdate(pointer, ['format'], {
            display_source: data.url,
        });
    }
}
