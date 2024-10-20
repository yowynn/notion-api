import type * as rt from './record-types.js';
import type Session from './session.js';
import { newUuid } from './util.js';

export type transaction = {
    id: rt.literal_uuid;
    spaceId?: rt.literal_uuid;
    debug?: any;
    operations: transaction_operation[];
};

export type transaction_operation = {
    pointer: rt.record_pointer;
    path: string[];
    command: string;
    args: any;
}

export default class SessionApi {
    private _session: Session;

    public constructor(session: Session) {
        this._session = session;
    }

    /**
     * API: get a list of any-type record data
     *
     * return record type: `any`
     */
    public async syncRecords(pointerList: rt.record_pointer[]) {
        const endpoint = 'syncRecordValues';
        // * also: const endpoint = 'syncRecordValuesMain';
        // * also: const endpoint = 'syncRecordValuesSpace';
        const payload = {
            requests: pointerList.map(pointer => ({
                pointer,
                version: -1,
            })),
        }
        return this._session.request('POST', endpoint, payload);
    }

    /**
     * API: get a any-type record data
     *
     * return record type: `any`
     */
    public async syncRecord(pointer: rt.record_pointer) {
        return this.syncRecords([pointer]);
    }

    /**
     * API: get a list of blocks data, and their associated records (cached)
     *
     * return record type: `block`, `discussion`, `collection`, `comment`, `collection_view`, `team`, ...
     */
    public async loadPages(ids: rt.literal_uuid[], limit: number = 100) {
        const endpoint = 'loadCachedPageChunks';
        const payload = {
            requests: ids.map(id => ({
                page: {
                    id,
                    spaceId: undefined,
                },
                limit,
                cursor: { stack: [] },
                verticalColumns: false,
            })),
        }
        return this._session.request('POST', endpoint, payload);
    }

    /**
     * API: get a block data, and its associated records
     *
     * return record type: `block`, `discussion`, `collection`, `comment`, `collection_view`, `team`, ...
     *
     * @param cached load cached data, default is `false`
     */
    public async loadPage(id: rt.literal_uuid, limit: number = 100, cached: boolean = false) {
        if (cached) {
            const endpoint = 'loadCachedPageChunk';
            const payload = {
                page: {
                    id,
                    spaceId: undefined,
                },
                limit,
                cursor: { stack: [] },
                verticalColumns: false,
            }
            return this._session.request('POST', endpoint, payload);
        }
        else {
            const endpoint = 'loadPageChunk';
            const payload = {
                pageId: id,
                limit,
                cursor: { stack: [] },
                chunkNumber: 0,
                verticalColumns: false,
            }
            return this._session.request('POST', endpoint, payload);
        }
    }

    /**
     * API: get a user's contents
     *
     * return record type: `notion_user`, `user_root`, `user_settings`, `space_view`, `team`, `space_user`, `space`, `block`, `collection`, ...
     */
    public async loadUser() {
        const endpoint = 'loadUserContent';
        return this._session.request('POST', endpoint);
    }

    /**
     * API: submit a list of transactions
     */

    public async submitTransactions(transactions: transaction[]) {
        const endpoint = 'saveTransactionsFanout';
        // * also: const endpoint = 'saveTransactionsMain';
        const payload = {
            requestId: newUuid(),
            transactions,
        }
        return this._session.request('POST', endpoint, payload);
    }

    /**
     * API: submit a transaction
     */
    public async submitTransaction(operations: transaction_operation[]) {
        return this.submitTransactions([{
            id: newUuid(),
            operations,
        }]);
    }

    /**
     * @deprecated
     * @see SessionApi.submitTransaction
     * @alias SessionApi.submitTransaction
     */
    public async submitTransactionDeprecated(operations: transaction_operation[]) {
        const endpoint = 'submitTransaction';
        const payload = {
            operations: operations.map(({ pointer: { table, id }, path, command, args }) => ({ table, id, path, command, args })),
        }
        return this._session.request('POST', endpoint, payload);
    }
}
