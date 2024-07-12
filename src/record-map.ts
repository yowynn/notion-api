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
    private clinet: Client;
    private block: Record<string, block_record> = {};
    private space: Record<string, space_record> = {};
    private team: Record<string, team_record> = {};

    public get records() {
        return {
            block: this.block,
            space: this.space,
            team: this.team,
        };
    }

    public constructor(client: Client) {
        this.clinet = client;
    }

    public async get_record(table: RecordType, id: string, update: boolean = false) {
        let record = this.get_record_cache(table, id);
        if (!record || update) {
            switch (table) {
                case 'block':
                    record = await this.request_load_page_chunk(id);
                    break;
                case 'space':
                    this.clinet.request('getSpace', { spaceId: id });
                    break;
                case 'team':
                    this.clinet.request('getTeam', { teamId: id });
                    break;
            }
        }
        return record;
    }

    public get_record_cache(table: RecordType, id: string) {
        const typeMap = this[table];
        if (!typeMap) {
            throw new UnsupportedError('RecordMap.get_record', table);
        }
        return typeMap[id];
    }

    public set_record(table: RecordType, record: record) {
        // log.info('RecordMap.set_record', table, record.id);
        this[table][record.id] = record as any;
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
        const data = await this.clinet.request('loadPageChunk', {
            pageId: id,
            limit: 100,
            cursor: { stack: [] },
            chunkNumber: 0,
            verticalColumns: false,
        });
        this.update_records((data as any).recordMap);
        return this.get_record_cache('block', id) as block_record;
    }
}

type key = keyof RecordMap;

const a: key = 'update_records';

const b = a as any instanceof RecordMap;
