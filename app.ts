console.log('Hello world');

import { Client } from './src/client.js';
import { NOTION_TOKEN_V2 } from './src/config.js';
import * as log from './src/log.js';
import { uuid } from './src/util.js';

const client = await Client.from_token(NOTION_TOKEN_V2);
var url, block;

url = process.env.URL_OR_UUID as string;
block = await client.get_block(url);
console.log('>>>>>>>>>>>>', JSON.stringify(block.record, null, 2));
