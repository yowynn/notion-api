import { Client, uuid, config, log, Block, rt, Collection, CollectionViewBlock } from './src/index.js'
// import * as index from './src/index.js'

const client = await Client.fromToken(config.NOTION_TOKEN_V2);
var url = process.env.URL_OR_UUID as string;
var id = uuid(url);

var block = await client.getBlock(id);

var record = await (block as CollectionViewBlock).getCollection();
log.info(record.createSchema, record.table);
record.createSchema(
    {
        name: 'Name2222',
        type: 'text',
    },
    {
        name: 'Age2222',
        type: 'number',
    }
);
