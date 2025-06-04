import { Client, util, rt, log, PageBlock, CollectionViewPageBlock } from '../src/index.js';
const client = await Client.fromToken(process.env.NOTION_TOKEN_V2 as string);
client.selectSpace(process.env.DEFAULT_SPACE_ID as rt.string_uuid);


const url_from = "https://www.notion.so/yowynn/2046b80204ff8149b09aff14f7401d92?v=2046b80204ff81578afb000c98c5f010&source=copy_link";
const url_to = "https://www.notion.so/yowynn/NotionIcon-2046b80204ff8183b643f1055a3a4883?source=copy_link";



const id_from = util.pointerTo(url_from).id;
const id_to = util.pointerTo(url_to).id;

var from_page = await client.getRecord<CollectionViewPageBlock>('block', id_from);
var from_collection = await from_page.getCollection();
var to_page = await client.getRecord<PageBlock>('block', id_to);


to_page.icon = from_collection.icon;
client.transaction.opCopyFile(to_page.pointer, { fileId: from_collection.icon.split(":").at(1) as rt.string_uuid, source: from_collection.pointer });
await client.action.done();
await to_page.idle();
log.info(from_collection.icon);
