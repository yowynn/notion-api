import { Client } from './client.js';
import { NOTION_TOKEN_V2 } from './config.js';

const client = await Client.from_token(NOTION_TOKEN_V2);
var url, block;


// url = 'https://www.notion.so/yowynn/Test-Blocks-291582bfde494f24856c2515b2290069?pvs=4#8c431b3258174c8b80a75f315a6028f1';
// url = 'https://www.notion.so/yowynn/Test-Blocks-291582bfde494f24856c2515b2290069?pvs=4#6eb3ac462ba84ad0bfa3817624d8007e';
// block = await client.get_block(url);
// log.info(block.record);
// log.info('>>>>>', block.title);

// block.title = `你好<br>**祖kkdddddddddddddddddsadsd国**`;

// const md = `<span style="color:red;"><u>***~~[哈<span style='background-color: blue'><u>哈哈</u></span> 哈](www)~~***</u></span>      $E=\\$mc^2$[www](https://www.notion.so/Test-Blocks-291582bfde494f24856c2515b2290069?pvs=21)aavvccc`;
// const rt = markdown2richtext(md)
// log.info(rt)
// log.info('-------------------------')
// log.info(md)
// log.info(richtext2markdown(rt))

// client.recordMap.request_load_user_content();
// client.recordMap.request_get_spaces();


// log.info('>>>>>', block.created_time, block.last_edited_time, block.type);
// block.type = 'page';
// await (block.version = 1);
// await (block.version = 1);
// await (block.title = '你好，李焕英$E=mc^2$');
// await (block.title = '你好');


// const data = await client.request('syncRecordValues', { "requests": [{ "pointer": { "table": "block", "id": uuid('291582bfde494f24856c2515b2290069')
// }, "version": -1 }] });
// log.write_json('syncRecordValues.json', data);
