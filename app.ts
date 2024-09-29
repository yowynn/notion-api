console.log('Hello world');

import { Client } from './src/client.js';
import { NOTION_TOKEN_V2 } from './src/config.js';
import * as log from './src/log.js';
import { uuid } from './src/util.js';

const client = await Client.from_token(NOTION_TOKEN_V2);
var url, block;

url = 'https://www.notion.so/yowynn/dbe826c8819443e9a1515465cec17e7e?pvs=4#0bb34367e3764927a642773642536ef0';
block = await client.get_block(url);
console.log('>>>>>>>>>>>>', JSON.stringify(block.record, null, 2));