import { Client, util, config, log, Block, rt, Collection, CollectionViewBlock, PageBlock, CollectionView } from './src/index.js'
// import * as index from './src/index.js'

const client = await Client.fromToken(process.env.NOTION_TOKEN_V2 as string);
client.selectSpace(process.env.DEFAULT_SPACE_ID as rt.string_uuid);

var url = process.env.URL_OR_UUID as string;
var id = util.uuid(url);
var block = await client.getRecord<Block>('block', id);
log.info('block:', block.record);
