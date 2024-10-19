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

    public async get(table: rt.collection_record_type, id: rt.literal_uuid, update: boolean = true, loadPage: boolean = true) {
        let record = this.getLocal(table, id);
        if (!record || update) {
            if (table === 'block' && loadPage) {
                const data = await this._client.sessionApi.loadPage(id);
                this.merge(data?.recordMap);
            }
            else {
                const data = await this._client.sessionApi.syncRecord(table, id);
                this.merge(data?.recordMap);
            }
            record = this.getLocal(table, id);
        }
        return record;
    }

    public getLocal(table: rt.collection_record_type, id: rt.literal_uuid) {
        const tableMap = this._map[table];
        if (!tableMap) {
            throw new UnsupportedError('RecordMap.getLocal', table);
        }
        return tableMap[id];
    }

    public merge(map: any) {
        if (!map) {
            return;
        }
        if (config.DEBUG_MODE) {
            log.writeFile('test/data-demos/record_map.json', map);
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
