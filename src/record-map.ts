import type * as rt from './record-types';
import type Client from './client.js';
import config from './config.js';
import log from './log.js';
import { UnsupportedError } from './error.js';
import { wrapQueryFilter } from './util.js';

export default class RecordMap {
    private _client: Client;
    private _map: rt.map_of_record;

    public constructor(client: Client) {
        this._client = client;
        this._map = {
            block: {} as Record<rt.string_uuid, rt.block>,
            space: {} as Record<rt.string_uuid, rt.record>,
            team: {} as Record<rt.string_uuid, rt.record>,
            collection_view: {} as Record<rt.string_uuid, rt.record>,
            collection: {} as Record<rt.string_uuid, rt.record>,
            discussion: {} as Record<rt.string_uuid, rt.record>,
            comment: {} as Record<rt.string_uuid, rt.record>,
            notion_user: {} as Record<rt.string_uuid, rt.record>,
            user_root: {} as Record<rt.string_uuid, rt.record>,
            user_settings: {} as Record<rt.string_uuid, rt.record>,
            bot: {} as Record<rt.string_uuid, rt.record>,
            space_view: {} as Record<rt.string_uuid, rt.record>,
            space_user: {} as Record<rt.string_uuid, rt.record>,
            custom_emoji: {} as Record<rt.string_uuid, rt.record>,
            layout: {} as Record<rt.string_uuid, rt.record>,
            automation: {} as Record<rt.string_uuid, rt.record>,
            automation_action: {} as Record<rt.string_uuid, rt.record>,
        };
    }

    public async get(pointer: rt.pointer, update: boolean = false, loadPage: boolean = false) {
        let record = this.getLocal(pointer);
        if (!record || update) {
            if (pointer.table === 'block' && loadPage) {
                const data = await this._client.sessionApi.loadPage(pointer.id);
                this.merge(data?.recordMap);
            }
            else {
                const data = await this._client.sessionApi.syncRecord(pointer);
                this.merge(data?.recordMap);
            }
            record = this.getLocal(pointer);
        }
        return record;
    }

    public async getList(pointerList: rt.pointer[]) {
        const data = await this._client.sessionApi.syncRecords(pointerList);
        this.merge(data?.recordMap);
        return pointerList.map(pointer => this.getLocal(pointer));
    }


    public async getQueryedResult(collectionPointer: rt.pointered<'collection'>, collectionViewPointer: rt.pointered<'collection_view'>, options?: rt.collection_query_options, returnType: 'all' | 'query' | 'count' = 'query') {
        const collectionView = await this.get(collectionViewPointer);
        const limit = options?.limit;
        const query = options?.query;
        const sort = options?.sort == undefined ? (collectionView as any).query2?.sort : options?.sort;
        const filter = options?.filter == undefined ? wrapQueryFilter((collectionView as any).format?.property_filters) : options?.filter;
        const data = await this._client.sessionApi.queryCollection(collectionPointer, collectionViewPointer, limit, query, sort, filter);
        this.merge(data?.recordMap);
        if (config.DEBUG_MODE) {
            log.writeFile('test/data-demos/queryCollection.json', data);
        }
        switch (returnType) {
            case 'all': {
                return data.allBlockIds ?? [];
            }
            case 'query': {
                return data.result?.reducerResults?.collection_group_results?.blockIds ?? [];
            }
            case 'count': {
                return data.result?.sizeHint ?? 0;
            }
        }
    }



    public markDirty(pointer: rt.pointer) {
        const record = this.getLocal(pointer);
        if (record) {
            (record as any).__dirty__ = true;
        }
    }

    public isDirty(pointer: rt.pointer) {
        const record = this.getLocal(pointer);
        if (record) {
            return (record as any).__dirty__;
        }
        return false;
    }

    public getLocal(pointer: rt.pointer) {
        const tableMap = this._map[pointer.table];
        if (!tableMap) {
            throw new UnsupportedError('RecordMap.getLocal', pointer.table);
        }
        return tableMap[pointer.id];
    }

    public setLocal(pointer: rt.pointer, record: rt.record) {
        const tableMap = this._map[pointer.table];
        if (!tableMap) {
            throw new UnsupportedError('RecordMap.setLocal', pointer.table);
        }
        tableMap[pointer.id] = record;
    }

    public merge(map: any) {
        if (!map) {
            return;
        }
        if (config.DEBUG_MODE) {
            log.writeFile('test/data-demos/recordMap.json', map);
        }
        const mapVersion = map.__version__ as number;
        for (const table in map) {
            if (table === '__version__') {
                continue;
            }
            const records = map[table];
            const tableMap = this._map[table as rt.type_of_record];
            if (tableMap) {
                for (const id in records) {
                    let record: rt.record;
                    if (mapVersion === 3) {
                        record = records[id]?.value?.value as rt.record;
                    }
                    else {
                        record = records[id]?.value as rt.record;
                    }
                    tableMap[id] = record;
                }
            }
            else {
                console.error('UnsupportedError: RecordMap.merge', table);
                continue;
            }
        }
    }
}
