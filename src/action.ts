import type * as rt from './record-types.js';
import type Transation from './transaction.js';

export default class Action {

    private _transaction: Transation;

    public constructor(transaction: Transation) {
        this._transaction = transaction;
    }

    public async setRecordProperty(table: rt.collection_record_type, id: rt.literal_uuid, path: string[], args: any) {
        this._transaction.opSet(table, id, path, args);
        await this._transaction.submit(true);
    }
}
