import type * as rt from './record-types';
import type Client from './client.js';
import type Session from './session.js';
import { newUuid } from './util.js';

export type transaction = {
    id: rt.string_uuid;
    spaceId?: rt.string_uuid;
    debug?: any;
    operations: transaction_operation[];
};

export type transaction_operation = {
    pointer: rt.pointer;
    path: string[];
    command: string;
    args: any;
}

export type upload_file_info = {
    name: string;
    contentType: string;
    contentLength: number;
}

export default class SessionApi {
    private _client: Client;
    private _session: Session;

    public constructor(client: Client, session: Session) {
        this._client = client;
        this._session = session;
    }

    /**
     * API: get a list of any-type record data
     *
     * return record type: `any`
     */
    public async syncRecords(pointerList: rt.pointer[]) {
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
    public async syncRecord(pointer: rt.pointer) {
        return this.syncRecords([pointer]);
    }

    /**
     * API: get a list of blocks data, and their associated records (cached)
     *
     * return record type: `block`, `discussion`, `collection`, `comment`, `collection_view`, `team`, ...
     */
    public async loadPages(ids: rt.string_uuid[], limit: number = 100) {
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
    public async loadPage(id: rt.string_uuid, limit: number = 100, cached: boolean = false) {
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

    /**
     * API: get upload file url
     */
    public async getUploadFileUrl(fileInfo: upload_file_info, relatedPointer?: rt.pointer) {
        const bucket = relatedPointer ? 'secure' : 'public';
        const endpoint = 'getUploadFileUrl';
        const payload = {
            bucket,
            name: fileInfo.name,
            contentType: fileInfo.contentType,
            record: relatedPointer,
            supportExtraHeaders: true,
            contentLength: fileInfo.contentLength,
        }
        return this._session.request('POST', endpoint, payload);
    }

    /**
     * API: query a collection
     */
    public async queryCollection(collectionPointer: rt.pointered<'collection'>, collectionViewPointer: rt.pointered<'collection_view'>, limit: number = 50, query: string = '') {
        const endpoint = 'queryCollection?src=initial_load';
        const payload = {
            source: {
                type: collectionPointer.table,
                id: collectionPointer.id,
                spaceId: collectionPointer.spaceId,
            },
            collectionView: {
                id: collectionViewPointer.id,
                spaceId: collectionViewPointer.spaceId,
            },
            loader: {
                reducers: {
                    collection_group_results: {
                        type: 'results',
                        limit: limit,
                    },
                },
                sort: [],
                searchQuery: query,
                userId: this._client.userId,
                userTimeZone: this._client.timeZone,
            },
        };
        return this._session.request('POST', endpoint, payload);
    }
}
