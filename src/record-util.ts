import { version } from 'os';
import type * as rt from './record-types';
import { newUuid } from './util.js';

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

export function getBlockTemplate(type: rt.type_of_block, userId: rt.string_uuid): rt.block {
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
        created_by_id: userId,
        last_edited_by_table: 'notion_user',
        last_edited_by_id: userId,
        space_id: undefined,
    } as any as rt.block;
}

export function getCollectionViewTemplate(type: rt.type_of_collection_view, userId: rt.string_uuid): rt.collection_view {
    const time = Date.now();
    const id = newUuid();
    return {
        id,
        version: 0,
        type,
        alive: true,
        format: {},
        space_id: undefined,
    } as any as rt.collection_view;
}

export function getCollectionTemplate(): rt.collection {
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
        space_id: undefined,
    } as any as rt.collection;
}
