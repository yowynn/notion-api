import { page_block } from './block.js';
import { Client } from './client.js';
import { NOTION_TOKEN_V2 } from './config.js';
import { markdown2richtext, richtext2markdown } from './converter.js';
import * as log from './log.js';

const client = Client.from_token(NOTION_TOKEN_V2);
var url, block;


// url = 'https://www.notion.so/yowynn/Test-Blocks-291582bfde494f24856c2515b2290069?pvs=4#8c431b3258174c8b80a75f315a6028f1';
// url = 'https://www.notion.so/yowynn/Test-Blocks-291582bfde494f24856c2515b2290069?pvs=4#6eb3ac462ba84ad0bfa3817624d8007e';
// block = await client.get_block(url);
// log.info(block.record);
// log.info(block.title);

const md = `<span style="color:red;"><u>***~~[哈<span style='background-color: blue'><u>哈哈</u></span> 哈](www)~~***</u></span>      $E=\\$mc^2$[www](https://www.notion.so/Test-Blocks-291582bfde494f24856c2515b2290069?pvs=21)aavvccc`;
const rt = markdown2richtext(md)
log.info(rt)
log.info('-------------------------')
log.info(md)
log.info(richtext2markdown(rt))
