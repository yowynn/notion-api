import type * as rt from './record-types.js';
import type Client from './client.js';
import type Transation from './transaction.js';
import { newUuid } from './util.js';

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

    public async setRecordProperty(pointer: rt.record_pointer, path: string[], args: any) {
        this._transaction.opSet(pointer, path, args);
        await this._transaction.submit(true);
    }

    public async deleteRecord(pointer: rt.record_pointer) {
        this._transaction.opUpdate(pointer, [], { alive: false });
        const record = await this._recordMap.get(pointer) as rt.block;
        if (record.parent_id && record.parent_table) {
            this._transaction.opListRemove({ table: record.parent_table, id: record.parent_id, spaceId: record.space_id }, ['content'], { id: pointer.id });
        }
        await this._transaction.submit(true);
    }

    public async createRecordPlaceholder(table: rt.collection_record_type, type: rt.collection_block_type) {
        switch (table) {
            case 'block': {
                const pointer = {
                    table,
                    id: newUuid(),
                } as rt.record_pointer;
                const time = Date.now();
                const record = {
                    id: pointer.id,
                    type,
                    alive: true,
                    space_id: undefined,
                    properties: {},
                    created_time: time,
                    last_edited_time: time,
                    last_edited_by_id: this._client.userId,
                    last_edited_by_table: 'notion_user',
                    created_by_id: this._client.userId,
                    created_by_table: 'notion_user',
                    format: {},
                };
                this._recordMap.setLocal(pointer, record as any as rt.record);
                this._transaction.opSet(pointer, [], record);
                // await this._transaction.submit(true);
                return pointer;
            }
            default:
                throw new Error(`Unsupported table: ${table}`);
        }
    }

    public async setRecordParent(pointer: rt.record_pointer, parentPointer: rt.record_pointer, index: number = -1, anchorId?: rt.literal_uuid) {
        const record = await this._recordMap.get(pointer) as rt.block;
        if (record.parent_id && record.parent_table) {
            this._transaction.opListRemove({ table: record.parent_table, id: record.parent_id, spaceId: record.space_id }, ['content'], { id: pointer.id });
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
        await this._transaction.submit(true);
    }
}
