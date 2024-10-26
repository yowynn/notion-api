import { version } from 'os';
import type * as rt from './record-types';
import { newUuid } from './util.js';
import Client from './client';

export function getPointer(record: rt.record, table: rt.type_of_record = 'block'): rt.pointer_to_record | null {
    const recordAny = record as any;
    if (recordAny && recordAny.id) {
        return { table, id: recordAny.id, spaceId: recordAny.space_id };
    }
    return null;
}

export function getParentPointer(record: rt.record): rt.pointer_to_record | null {
    const recordAny = record as any;
    if (recordAny && recordAny.parent_id && recordAny.parent_table) {
        return { table: recordAny.parent_table, id: recordAny.parent_id, spaceId: recordAny.space_id };
    }
    return null;
}

export function getFileSizeString(size: number): string {
    if (size < 1024) {
        return size + 'B';
    }
    if (size < 1024 * 1024) {
        return (size / 1024).toFixed(2) + 'KB';
    }
    if (size < 1024 * 1024 * 1024) {
        return (size / 1024 / 1024).toFixed(2) + 'MB';
    }
    return (size / 1024 / 1024 / 1024).toFixed(2) + 'GB';
}

export function getBlockTemplate(client: Client, type: rt.type_of_block): rt.block {
    const time = Date.now();
    const id = newUuid();
    return {
        id,
        version: 0,
        type,
        alive: true,
        properties: {},
        format: {},
        created_time: time,
        last_edited_time: time,
        created_by_table: 'notion_user',
        created_by_id: client.userId,
        last_edited_by_table: 'notion_user',
        last_edited_by_id: client.userId,
        space_id: client.spaceId,
    } as any as rt.block;
}

export function getCollectionViewTemplate(client: Client, type: rt.type_of_collection_view): rt.collection_view {
    const id = newUuid();
    return {
        id,
        version: 0,
        type,
        alive: true,
        format: {},
        space_id: client.spaceId,
    } as any as rt.collection_view;
}

export function getCollectionTemplate(client: Client): rt.collection {
    const id = newUuid();
    return {
        id,
        version: 0,
        schema: {
            "title": {
                "name": "名称",
                "type": "title"
            },
        },
        format: {},
        alive: true,
        space_id: client.spaceId,
    } as any as rt.collection;
}

export function getCustomEmojiTemplate(client: Client, name: string, url: rt.string_url): rt.custom_emoji {
    const time = Date.now();
    const id = newUuid();
    return {
        id,
        version: 0,
        name,
        url,
        created_time: time,
        created_by_table: 'notion_user',
        created_by_id: client.userId,
        alive: true,
        space_id: client.spaceId,
    } as any as rt.custom_emoji;
}


