import * as block from './block.js';
import { Client } from './client.js';
import { record } from './record.js';
import * as rt from './record-types.js';

const type_map: { [key: string]: new (client: any, record: any) => record } = {};

type_map.record = record;

for (const key in block) {
    type_map[key] = (block as any)[key];
}

export const new_record = (client: Client, record: rt.record, table: rt.collection_record_type = 'block') => {
    const type = (record as any).type;
    let type_key = table;
    if (type) {
        type_key = type_key + '_' + type;
    }
    const ctor = type_map[type_key] ?? type_map[table] ?? type_map.record;
    return new ctor(client, record);
}


