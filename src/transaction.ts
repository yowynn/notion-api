import type * as rt from './record-types';
import type Client from './client.js';
import type { transaction, transaction_operation } from './session-api.js'
import { newUuid } from './util.js';
import log from './log.js';

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

    public opSet(pointer: rt.pointer_to_record, path: string[], args: any) {
        const operation = {
            command: 'set',
            pointer,
            path,
            args,
        }
        this.addOperation(operation);
    }

    public opUpdate(pointer: rt.pointer_to_record, path: string[], args: any) {
        const operation = {
            command: 'update',
            pointer,
            path,
            args,
        }
        this.addOperation(operation);
    }

    public opListRemove(pointer: rt.pointer_to_record, path: string[], args: { id: any }) {
        const operation = {
            command: 'listRemove',
            pointer,
            path,
            args,
        }
        this.addOperation(operation);
    }

    public opListBefore(pointer: rt.pointer_to_record, path: string[], args: { before?: any, id: any }) {
        const operation = {
            command: 'listBefore',
            pointer,
            path,
            args,
        }
        this.addOperation(operation);
    }

    public opListAfter(pointer: rt.pointer_to_record, path: string[], args: { after?: any, id: any }) {
        const operation = {
            command: 'listAfter',
            pointer,
            path,
            args,
        }
        this.addOperation(operation);
    }

    public opSetParent(pointer: rt.pointer_to_record, path: string[], args: { parentId: rt.string_uuid, parentTable: rt.type_of_record }) {
        const operation = {
            command: 'setParent',
            pointer,
            path,
            args,
        }
        this.addOperation(operation);
    }

    public opKeyedObjectListAfter(pointer: rt.pointer_to_record, path: string[], args: { value: any }) {
        const operation = {
            command: 'keyedObjectListAfter',
            pointer,
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
            const pointers: rt.pointer_to_record[] = transactions.map(transaction => transaction.operations.map(operation => operation.pointer)).flat();
            const uniquePointers = pointers.filter((pointer, index) => pointers.indexOf(pointer) === index);
            const data = await this._client.sessionApi.syncRecords(uniquePointers);
            this._client.recordMap.merge(data?.recordMap);
        }
    }

    private async updateEditedInfo(operations: transaction_operation[]) {
        const lastEditedInfo = {
            last_edited_by_id: this._client.userId,
            last_edited_by_table: 'notion_user',
            last_edited_time: Date.now(),
        }
        const editedPointerList: rt.pointer_to_record[] = [];
        for (let operation of operations) {
            if (operation.command === 'set' || operation.command === 'update') {
                editedPointerList.push(operation.pointer);
                if (operation.pointer.table === 'block') {
                    const pagePointer = await this.getParentPage(operation.pointer);
                    if (pagePointer?.id !== operation.pointer.id) {
                        editedPointerList.push(pagePointer);
                    }
                }
            }
        }
        editedPointerList.forEach(pointer => {
            this.opUpdate(pointer, [], lastEditedInfo);
        });
    }

    private async getParentPage(pointer: rt.pointer_to_record) {
        var record = await this._client.recordMap.get(pointer) as rt.block;
        const newPointer = Object.assign({}, pointer);
        while (record.type !== 'page' && record.type !== 'collection_view_page' && record.type !== 'collection_view' && record.parent_table === 'block') {
            newPointer.table = record.parent_table;
            newPointer.id = record.parent_id;
            record = await this._client.recordMap.get(newPointer) as rt.block;
        }
        return newPointer;
    }
}
