import { Client, uuid, config, log } from './src/index.js'
// import * as index from './src/index.js'

const client = await Client.fromToken(config.NOTION_TOKEN_V2);
var url = process.env.URL_OR_UUID as string;
var id = uuid(url);

var block = await client.getBlock(id);
log.info(block.title);
block.title = 'Hello World';
await block.refresh();
log.info(block.lastEditedTime.toLocaleString());
