import type * as rt from './record-types.js';
import type Client from './client.js';
import type { transaction, transaction_operation } from './session-api.js'
import { newUuid } from './util.js';

export default class Transation {

    private _client: Client;
    private _inTransaction: boolean;
    private _isSilent: boolean;
    private _transactions: transaction[];
    private _operations: transaction_operation[];

    public constructor(client: Client) {
        this._client = client;
        this._inTransaction = false;
        this._isSilent = false;
        this._transactions = [];
        this._operations = [];
    }

    public begin(isSilent: boolean = false) {
        this._inTransaction = true;
        this._isSilent = isSilent;
    }

    public async end(refreshRecords: boolean = false) {
        await this.submitAll(refreshRecords);
        this._inTransaction = false;
        this._isSilent = false;
    }

    public opSet(table: rt.collection_record_type, id: rt.literal_uuid, path: string[], args: any) {
        const operation = {
            command: 'set',
            pointer: { table, id },
            path,
            args,
        }
        this.addOperation(operation);
    }

    public opUpdate(table: rt.collection_record_type, id: rt.literal_uuid, path: string[], args: any) {
        const operation = {
            command: 'update',
            pointer: { table, id },
            path,
            args,
        }
        this.addOperation(operation);
    }

    public async submit(refreshRecords: boolean = false) {
        if (!this._isSilent) {
            await this.updateEditedInfo(this._operations);
        }
        const transaction = {
            id: newUuid(),
            operations: this._operations,
        }
        this._transactions.push(transaction);
        this._operations = [];
        if (!this._inTransaction) {
            await this.submitAll(refreshRecords);
        }
    }

    private addOperation(operation: transaction_operation) {
        this._operations.push(operation);
    }

    private async submitAll(refreshRecords: boolean = false) {
        if (this._transactions.length === 0) {
            return;
        }
        const transactions = this._transactions;
        this._transactions = [];
        await this._client.sessionApi.submitTransactions(transactions);
        if (refreshRecords) {
            const pointers: rt.reference_pointer[] = transactions.map(transaction => transaction.operations.map(operation => operation.pointer)).flat();
            const uniquePointers = pointers.filter((pointer, index) => pointers.indexOf(pointer) === index);
            const data = await this._client.sessionApi.syncRecords(uniquePointers);
            this._client.recordMap.merge(data?.recordMap);
        }
    }

    private async updateEditedInfo(operations: transaction_operation[]) {
        const lastEditedInfo = {
            last_edited_by_id: this._client.userID,
            last_edited_by_table: 'notion_user',
            last_edited_time: Date.now(),
        }
        const editedRecordIds: rt.literal_uuid[] = [];
        for (let operation of operations) {
            if (operation.command === 'set' || operation.command === 'update') {
                editedRecordIds.push(operation.pointer.id);
                if (operation.pointer.table === 'block') {
                    const page = await this.getParentPage(operation.pointer.id);
                    if (page?.id !== operation.pointer.id) {
                        editedRecordIds.push(page.id);
                    }
                }
            }
        }
        editedRecordIds.forEach((id, index) => {
            if (editedRecordIds.indexOf(id) === index) {
                this.opUpdate('block', id, [], lastEditedInfo);
            }
        });
    }

    private async getParentPage(id: rt.literal_uuid) {
        var record = await this._client.recordMap.get('block', id, false) as rt.block;
        while (record.type !== 'page' && record.type !== 'collection_view_page' && record.type !== 'collection_view' && record.parent_table === 'block') {
            record = await this._client.recordMap.get('block', record.parent_id, false) as rt.block;
        }
        return record;
    }
}
