import { Client, util, config, log, Block, rt, Collection, CollectionViewBlock, PageBlock, CollectionView } from './src/index.js'
import markdown from './src/markdown.js';
// import * as index from './src/index.js'

const client = await Client.fromToken(process.env.NOTION_TOKEN_V2 as string);
client.selectSpace(process.env.DEFAULT_SPACE_ID as rt.string_uuid);

var url = process.env.URL_OR_UUID as string;
var id = util.pointerTo(url).id;
var block = await client.getRecord<Block>('block', id);
// log.info('block:', block.record);

// const children = await block.getChildren();
// const data = await markdown.fromChunk(children);
// log.writeFile('output.md', data);

const data = await util.readFile('output.md', true) as string;
// log.info('data:', data);
await markdown.toChunk(data, block);
