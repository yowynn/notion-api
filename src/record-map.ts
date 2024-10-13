import { Client } from './client.js';
import { config } from './config.js';
import { UnsupportedError } from './error.js';
import { log } from './log.js';
import * as types from './record-types.js';
import * as api from './api.js';

type record_map = Partial<Record<types.collection_record_type, Record<types.literal_uuid, types.record>>>;

export class RecordMap {
    private client: Client;
    private map: record_map;


    public constructor(client: Client) {
        this.client = client;
        this.map = {
            block: {} as Record<types.literal_uuid, types.block>,
            space: {} as Record<types.literal_uuid, types.record>,
            team: {} as Record<types.literal_uuid, types.record>,
            collection_view: {} as Record<types.literal_uuid, types.record>,
            collection: {} as Record<types.literal_uuid, types.record>,
            discussion: {} as Record<types.literal_uuid, types.record>,
            comment: {} as Record<types.literal_uuid, types.record>,
            notion_user: {} as Record<types.literal_uuid, types.record>,
            user_root: {} as Record<types.literal_uuid, types.record>,
            user_settings: {} as Record<types.literal_uuid, types.record>,
            bot: {} as Record<types.literal_uuid, types.record>,
            space_view: {} as Record<types.literal_uuid, types.record>,
            space_user: {} as Record<types.literal_uuid, types.record>,
        };
    }

    public async get_record(table: types.collection_record_type, id: types.literal_uuid, update: boolean = true) {
        let record = this.get_record_cache(table, id);
        if (!record || update) {
            await this.call_api(api.syncRecordValue(table, id));
            record = this.get_record_cache(table, id);
        }
        return record;
    }

    public get_record_cache(table: types.collection_record_type, id: types.literal_uuid) {
        const typeMap = this.map[table];
        if (!typeMap) {
            throw new UnsupportedError('RecordMap.get_record_cache', table);
        }
        return typeMap[id];
    }

    private cache_record(table: types.collection_record_type, record: types.record) {
        const typeMap = this.map[table];
        if (!typeMap) {
            console.error('UnsupportedError: RecordMap.set_record', table);
            return;
        }
        typeMap[record.id] = record;
    }

    private cache_records(data: any) {
        const recordMap = data?.recordMap;
        if (!recordMap) {
            return;
        }
        const recordMapVersion = recordMap.__version__;
        for (const type in recordMap) {
            const records = recordMap[type];
            for (const id in records) {
                let record: types.record;
                if (recordMapVersion === 3) {
                    record = records[id].value.value as types.record;
                }
                else {
                    record = records[id].value as types.record;
                }
                this.cache_record(type as types.collection_record_type, record);
            }
        }
    }

    public async call_api(api: api.api_data) {
        const data = await this.client.request(api.api, api.data);
        if (config.DEBUG_MODE)
            log.write_json('test/data-demos/recordMap.json', data);
        this.cache_records(data);
        return data;
    }

    public async load_page_chunk(block_id: types.literal_uuid) {
        await this.call_api(api.loadCachedPageChunk(block_id));
    }

    public async set_block_property(id: types.literal_uuid, path: string[], value: any) {
        const now = Date.now();
        const last_edited_args = {
            last_edited_by_id: this.client.user_id,
            last_edited_by_table: 'notion_user',
            last_edited_time: now,
        }
        // find page parent
        const parent = await this.get_block_parent_page(id);

        const operations = [
            {
                pointer: { table: 'block' as types.collection_record_type, id: id },
                path,
                command: 'set',
                args: value,
            },
            {
                pointer: { table: 'block' as types.collection_record_type, id: id },
                path: [],
                command: 'update',
                args: last_edited_args,
            }
        ];
        if (parent.id !== id) {
            operations.push({
                pointer: { table: 'block' as types.collection_record_type, id: parent.id },
                path: [],
                command: 'update',
                args: last_edited_args,
            });
        }
        await this.call_api(api.saveTransactionFanout(operations));
    }

    private async get_block_parent_page(id: string) {
        var record = await this.get_record('block', id, false) as types.block;
        while (record.type !== 'page' && record.type !== 'collection_view_page' && record.type !== 'collection_view' && record.parent_table === 'block') {
            record = await this.get_record('block', record.parent_id, false) as types.block;
        }
        return record;
    }
}
