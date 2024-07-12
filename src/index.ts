import { page_block } from './block.js';
import { Client } from './client.js';
import { NOTION_TOKEN_V2 } from './config.js';
import * as log from './log.js';

const client = Client.from_token(NOTION_TOKEN_V2);
let block;
// block = await client.get_block('https://www.notion.so/yowynn/The-TEST-Page-291582bfde494f24856c2515b2290069?pvs=4#f2c5a3485c094157af7a56791150b034');
// console.log(block);
block = await client.get_block('https://www.notion.so/yowynn/The-TEST-Page-291582bfde494f24856c2515b2290069?pvs=4');
console.log(block.version);
console.log(block.created_time.toLocaleString());
console.log(block.last_edited_time.toLocaleString());



