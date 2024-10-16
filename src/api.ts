import { new_uuid } from './util.js';
import * as rt from './record-types.js';

export type api_data = {
    api: string;
    data?: any;
};

type transaction = {
    id?: rt.literal_uuid;
    operations: transaction_operation[];
    spaceId?: rt.literal_uuid;
};

type transaction_operation = {
    pointer: rt.reference_pointer;
    path: string[];
    command: string;
    args: any;
}

/**
 * API: get a list of any-type record data
 *
 * return record type: `any`
 */
export const syncRecordValues = function (record_pointers: rt.reference_pointer[]) {
    return {
        // * also: `syncRecordValuesMain`, `syncRecordValuesSpace`
        api: 'syncRecordValues',
        data: {
            requests: record_pointers.map(pointer => ({
                pointer,
                version: -1,
            })),
        },
    };
};

/**
 * API: get a any-type record data
 *
 * return record type: `any`
 */
export const syncRecordValue = function (table: rt.collection_record_type, id: rt.literal_uuid) {
    return syncRecordValues([{ table, id }]);
};

/**
 * API: get a list of blocks data, and their associated records (cached)
 *
 * return record type: `block`, `discussion`, `collection`, `comment`, `collection_view`, `team`, ...
 */
export const loadCachedPageChunks = function (ids: rt.literal_uuid[], limit: number = 100) {
    return {
        api: 'loadCachedPageChunks',
        data: {
            requests: ids.map(id => ({
                page: {
                    id: id,
                    // spaceId: '',
                },
                limit,
                cursor: { stack: [] },
                verticalColumns: false,
            })),
        },
    };
};

/**
 * API: get a block data, and its associated records (cached)
 *
 * return record type: `block`, `discussion`, `collection`, `comment`, `collection_view`, `team`, ...
 */
export const loadCachedPageChunk = function (id: rt.literal_uuid, limit: number = 100) {
    return {
        api: 'loadCachedPageChunk',
        data: {
            page: {
                id: id,
                // spaceId: '',
            },
            limit: limit,
            cursor: { stack: [] },
            verticalColumns: false,
        },
    };
};

/**
 * API: get a block data, and its associated records
 *
 * return record type: `block`, `discussion`, `collection`, `comment`, `collection_view`, `team`, ...
 */
export const loadPageChunk = function (id: rt.literal_uuid, limit: number = 100) {
    return {
        // * also: `loadCachedPageChunk`
        api: 'loadPageChunk',
        data: {
            pageId: id,
            limit: limit,
            cursor: { stack: [] },
            chunkNumber: 0,
            verticalColumns: false,
        },
    };
};

/**
 * API: get a user's contents
 *
 * return record type: `notion_user`, `user_root`, `user_settings`, `space_view`, `team`, `space_user`, `space`, `block`, `collection`, ...
 */
export const loadUserContent = function () {
    return {
        api: 'loadUserContent',
        data: {},
    };
};

/**
 * API: get a list of user's spaces
 *
 * return record type: `space`
 */
export const getSpaces = function () {
    return {
        api: 'getSpaces',
        data: {},
    };
};

/**
 * API: get a list of user's teams
 *
 * return record type: `team`
 */
export const getTeams = function (spaceId: rt.literal_uuid) {
    return {
        api: 'getTeams',
        data: {
            onlyJoined: true,
            spaceId: spaceId,
        },
    };
};

/**
 * API: save a list of transactions
 */
export const saveTransactionsFanout = function (transactions: transaction[]) {
    transactions.forEach(transaction => {
        transaction.id = transaction.id || new_uuid();
    });
    return {
        api: 'saveTransactionsFanout',
        data: {
            requestId: new_uuid(),
            transactions: transactions,
        },
    };
};

/**
 * API: save a transaction
 */
export const saveTransactionFanout = function (operations: transaction_operation[]) {
    return saveTransactionsFanout([{ operations }]);
}

/**
 * @deprecated
 * @see saveTransactionFanout
 * @alias saveTransactionFanout
 */
export const submitTransaction = function (operations: transaction_operation[]) {
    const deprecated_operations = operations.map(operation => ({
        table: operation.pointer.table,
        id: operation.pointer.id,
        path: operation.path,
        command: operation.command,
        args: operation.args,
    }));
    return {
        api: 'submitTransaction',
        data: {
            operations: deprecated_operations,
        },
    };
};
