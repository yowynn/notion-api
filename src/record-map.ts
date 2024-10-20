import type * as rt from './record-types.js';
import type Client from './client.js';
import config from './config.js';
import log from './log.js';
import { UnsupportedError } from './error.js';

export default class RecordMap {
    private _client: Client;
    private _map: rt.record_map;

    public constructor(client: Client) {
        this._client = client;
        this._map = {
            block: {} as Record<rt.literal_uuid, rt.block>,
            space: {} as Record<rt.literal_uuid, rt.record>,
            team: {} as Record<rt.literal_uuid, rt.record>,
            collection_view: {} as Record<rt.literal_uuid, rt.record>,
            collection: {} as Record<rt.literal_uuid, rt.record>,
            discussion: {} as Record<rt.literal_uuid, rt.record>,
            comment: {} as Record<rt.literal_uuid, rt.record>,
            notion_user: {} as Record<rt.literal_uuid, rt.record>,
            user_root: {} as Record<rt.literal_uuid, rt.record>,
            user_settings: {} as Record<rt.literal_uuid, rt.record>,
            bot: {} as Record<rt.literal_uuid, rt.record>,
            space_view: {} as Record<rt.literal_uuid, rt.record>,
            space_user: {} as Record<rt.literal_uuid, rt.record>,
        };
    }

    public async get(pointer: rt.record_pointer, update: boolean = false, loadPage: boolean = false) {
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

    public async getList(pointerList: rt.record_pointer[]) {
        const data = await this._client.sessionApi.syncRecords(pointerList);
        this.merge(data?.recordMap);
        return pointerList.map(pointer => this.getLocal(pointer));
    }

    public getLocal(pointer: rt.record_pointer) {
        const tableMap = this._map[pointer.table];
        if (!tableMap) {
            throw new UnsupportedError('RecordMap.getLocal', pointer.table);
        }
        return tableMap[pointer.id];
    }

    public setLocal(pointer: rt.record_pointer, record: rt.record) {
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
            const tableMap = this._map[table as rt.collection_record_type];
            if (tableMap) {
                for (const id in records) {
                    let record: rt.record;
                    if (mapVersion === 3) {
                        record = records[id].value.value as rt.record;
                    }
                    else {
                        record = records[id].value as rt.record;
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
