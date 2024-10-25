import { Client, util, config, log, Block, rt, Collection, CollectionViewBlock, PageBlock } from './src/index.js'
// import * as index from './src/index.js'

const client = await Client.fromToken(config.NOTION_TOKEN_V2);
var url = process.env.URL_OR_UUID as string;
var id = util.uuid(url);

var block = await client.getBlock(id);

// var record = await (block as CollectionViewBlock).getCollection();
// log.info(record.createSchema, record.table);
// record.createSchema(
//     {
//         name: 'Name2222',
//         type: 'text',
//     },
//     {
//         name: 'Age2222',
//         type: 'number',
//     }
// );
// record.set(['schema', 'title'], null);

