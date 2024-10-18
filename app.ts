import Client from './src/client.js';
import config from './src/config.js';
import log from './src/log.js';
import { uuid } from './src/util.js';

const client = await Client.fromToken(config.NOTION_TOKEN_V2);
var url = process.env.URL_OR_UUID as string;
var id = uuid(url);

var block = await client.getBlock(id);
log.info(block.title);
