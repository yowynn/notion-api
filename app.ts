import { Client, uuid, config, log, Block } from './src/index.js'
// import * as index from './src/index.js'

const client = await Client.fromToken(config.NOTION_TOKEN_V2);
var url = process.env.URL_OR_UUID as string;
var id = uuid(url);

// var block = await client.getBlock(id);
// await block.delete();
// log.info(block.record);
// block.alive = true;
// var parent = await block.getParent<Block>();
// client.beginTransaction();
// for (var i = 0; i < parent.childCount; i++) {
//     var child = await parent.getChild<Block>(i);
//     child.blockColor = 'yellow';
// }
// client.endTransaction();
// client.beginTransaction();
const r = await client.recordMap.get({ table: 'collection' as any, id }, true);
log.info(r);

// const b = await client.createCollection('table', 'child', block, true);
// log.info('1111')

// client.endTransaction();
