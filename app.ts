import * as api from './src/api.js';
import { block } from './src/block.js';
import { Client } from './src/client.js';
import { config } from './src/config.js';
import { log } from './src/log.js';
import { record } from './src/record.js';
import { uuid } from './src/util.js';

const client = await Client.from_token(config.NOTION_TOKEN_V2);
var url = process.env.URL_OR_UUID as string;

var id = uuid(url);

// var record = await client.record_map.call_api(api.syncRecordValue('block', id));
// var o = await client.get_block(id);
// console.log('>>>>>>>>>>>>', o.title);

// var p = await o.get_parent<block>();

// console.log('>>>>>>>>>>>>', p.child_count);
// for (let i = 0; i < p.child_count; i++) {
//     console.log('>>>>>>>>>>>>', (await p.get_child(i)).title);
// }

// console.log('>>>>>>>>>>>>', JSON.stringify(record, null, 2));

var o2 = await client.get_block('https://www.notion.so/yowynn/11f6b80204ff8079942affd53125f620?pvs=4#1206b80204ff808b944ef32948ca2a24');

o2.title = '[杜剑华](www.baidu.com)';
