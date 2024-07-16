import { Client } from './client.js';
import { UnsupportedError } from './error.js';
import * as log from './log.js';
import { uuid } from './util.js';

interface record {
    id: string;
    version: number;
    created_time: number;
    last_edited_time: number;
    created_by_table: string;
    created_by_id: string;
    last_edited_by_table: string;
    last_edited_by_id: string;
}


export interface block_record extends record {
    type: string;
    properties: Record<string, unknown>;
    content?: string[];
    format?: Record<string, unknown>;
    parent_id: string;
    parent_table: string;
    alive: boolean;
    file_ids?: string[];
    space_id: string;
}

export interface space_record extends record {
    name: string;
    permissions: unknown[];
    domain: string;
    icon: string;
    beta_enabled: boolean;
    pages: string[];
    disable_public_access: boolean;
    disable_guests: boolean;
    disable_move_to_space: boolean;
    disable_export: boolean;
    plan_type: string;
    invite_link_enabled: boolean;
    disable_space_page_edits: boolean;
    disable_public_access_requests: boolean;
    disable_team_creation: boolean;
    settings: Record<string, unknown>;
    subscription_tier: string;
    short_id: number;
    short_id_str: string;
}

export interface team_record extends record {
    space_id: string;
    name: string;
    description: string;
    icon: string;
    team_pages: string[];
    parent_id: string;
    parent_table: string;
    settings: Record<string, unknown>;
    is_default: boolean;
    permissions: unknown[];
    membership: unknown[];
}

export type RecordType = 'block' | 'space' | 'team';

export class RecordMap {
    private client: Client;
    private block: Record<string, block_record> = {};
    private space: Record<string, space_record> = {};
    private team: Record<string, team_record> = {};
    private collection_view: Record<string, any> = {};
    private collection: Record<string, any> = {};
    private discussion: Record<string, any> = {};
    private comment: Record<string, any> = {};

    public get records() {
        return {
            block: this.block,
            space: this.space,
            team: this.team,
        };
    }

    public constructor(client: Client) {
        this.client = client;
    }

    public async get_record(table: RecordType, id: string, update: boolean = false) {
        let record = this.get_record_cache(table, id);
        if (!record || update) {
            switch (table) {
                case 'block':
                    record = await this.request_load_page_chunk(id);
                    break;
                case 'space':
                    this.client.request('getSpace', { spaceId: id });
                    break;
                case 'team':
                    this.client.request('getTeam', { teamId: id });
                    break;
            }
        }
        return record;
    }

    public get_record_cache(table: RecordType, id: string) {
        const typeMap = this[table];
        if (!typeMap) {
            throw new UnsupportedError('RecordMap.get_record_cache', table);
        }
        return typeMap[id];
    }

    public set_record(table: RecordType, record: record) {
        // log.info('RecordMap.set_record', table, record.id);
        const typeMap = this[table];
        if (!typeMap) {
            throw new UnsupportedError('RecordMap.set_record', table);
        }
        typeMap[record.id] = record as any;
    }

    public update_records(recordMap: any) {
        for (const type in recordMap) {
            const records = recordMap[type];
            for (const id in records) {
                const record = records[id].value as record;
                this.set_record(type as RecordType, record);
            }
        }
    }

    public async request_load_page_chunk(id: string) {
        id = uuid(id);
        const data = await this.client.request('loadPageChunk', {
            pageId: id,
            limit: 100,
            cursor: { stack: [] },
            chunkNumber: 0,
            verticalColumns: false,
        });
        // log.write_json('a.json', data);
        this.update_records((data as any).recordMap);
        return this.get_record_cache('block', id) as block_record;
    }

    public async request_load_user_content()
    {
        const data = await this.client.request('loadUserContent', {});
        this.update_records((data as any).recordMap);
    }

    public async request_get_spaces()
    {
        const data = await this.client.request('getSpaces', {});
        this.update_records((data as any).recordMap);
    }

    public async request_submit_transaction(operations: any[]) {
        const data = await this.client.request('submitTransaction', { operations });
        // this.update_records((data as any).recordMap);
    }

    public async request_submit_transaction_set_record_values(id: string, path: string[], value: any) {
        const operations = [
            {
                command: 'set',
                table: 'block',
                id,
                path,
                args: value,
            },
            {
                command: 'update',
                table: 'block',
                id,
                path: [],
                args: {
                    last_edited_by_id: this.client.user_id,
                    last_edited_by_table: 'notion_user',
                    last_edited_time: Date.now(),
                },
            }
        ];
        await this.request_submit_transaction(operations);
    }
}
