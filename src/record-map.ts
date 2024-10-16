import { Client } from './client.js';
import { config } from './config.js';
import { UnsupportedError } from './error.js';
import { log } from './log.js';
import * as rt from './record-types.js';
import * as api from './api.js';

type record_map = Partial<Record<rt.collection_record_type, Record<rt.literal_uuid, rt.record>>>;

export class RecordMap {
    private client: Client;
    private map: record_map;


    public constructor(client: Client) {
        this.client = client;
        this.map = {
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

    public async get_record(table: rt.collection_record_type, id: rt.literal_uuid, update: boolean = true) {
        let record = this.get_record_cache(table, id);
        if (!record || update) {
            await this.call_api(api.syncRecordValue(table, id));
            record = this.get_record_cache(table, id);
        }
        return record;
    }

    public get_record_cache(table: rt.collection_record_type, id: rt.literal_uuid) {
        const type_map = this.map[table];
        if (!type_map) {
            throw new UnsupportedError('RecordMap.get_record_cache', table);
        }
        return type_map[id];
    }

    private cache_record(table: rt.collection_record_type, record: rt.record) {
        const type_map = this.map[table];
        if (!type_map) {
            console.error('UnsupportedError: RecordMap.set_record', table);
            return;
        }
        type_map[record.id] = record;
    }

    private cache_records(data: any) {
        const record_map = data?.recordMap;
        if (!record_map) {
            return;
        }
        const record_map_version = record_map.__version__;
        for (const type in record_map) {
            const records = record_map[type];
            for (const id in records) {
                let record: rt.record;
                if (record_map_version === 3) {
                    record = records[id].value.value as rt.record;
                }
                else {
                    record = records[id].value as rt.record;
                }
                this.cache_record(type as rt.collection_record_type, record);
            }
        }
    }

    public async call_api(api: api.api_data) {
        const data = await this.client.request(api.api, api.data);
        if (config.DEBUG_MODE)
            log.write_json('test/data-demos/record_map.json', data);
        this.cache_records(data);
        return data;
    }

    public async load_page_chunk(block_id: rt.literal_uuid) {
        await this.call_api(api.loadPageChunk(block_id));
    }

    public async set_block_property(id: rt.literal_uuid, path: string[], value: any) {
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
                pointer: { table: 'block' as rt.collection_record_type, id: id },
                path,
                command: 'set',
                args: value,
            },
            {
                pointer: { table: 'block' as rt.collection_record_type, id: id },
                path: [],
                command: 'update',
                args: last_edited_args,
            }
        ];
        if (parent.id !== id) {
            operations.push({
                pointer: { table: 'block' as rt.collection_record_type, id: parent.id },
                path: [],
                command: 'update',
                args: last_edited_args,
            });
        }
        await this.call_api(api.saveTransactionFanout(operations));
        await this.get_record('block', id, true);
    }

    private async get_block_parent_page(id: string) {
        var record = await this.get_record('block', id, false) as rt.block;
        while (record.type !== 'page' && record.type !== 'collection_view_page' && record.type !== 'collection_view' && record.parent_table === 'block') {
            record = await this.get_record('block', record.parent_id, false) as rt.block;
        }
        return record;
    }
}
