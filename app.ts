import { Client } from './src/client.js';
import { config } from './src/config.js';
import { log } from './src/log.js';
import { uuid } from './src/util.js';

console.log('Hello world');

const client = await Client.from_token(config.NOTION_TOKEN_V2);
var url = process.env.URL_OR_UUID as string;

var id = uuid(url);
console.log('id:', id);
// var record = (await client.get_block(id)).record;
var record = await client.request('syncRecordValues', {
    requests: [
        {
            pointer: {
                table: 'block',
                id: id,
            },
            version: -1,
        },
    ],
});
console.log('>>>>>>>>>>>>', JSON.stringify(record, null, 2));
