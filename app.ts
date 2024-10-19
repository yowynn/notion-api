import { Client, uuid, config, log, Block } from './src/index.js'
// import * as index from './src/index.js'

const client = await Client.fromToken(config.NOTION_TOKEN_V2);
var url = process.env.URL_OR_UUID as string;
var id = uuid(url);

var block = await client.getBlock(id);
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
client.beginTransaction();
const b1 = await client.createBlock('text', 'child', block);
b1.title = 'child:1111111';
const b2 = await client.createBlock('sub_sub_header', 'before', block);
b2.title = 'before:2222222';
const b3 = await client.createBlock('bulleted_list', 'after', block);
b3.title = 'after:3333333';
client.endTransaction();
