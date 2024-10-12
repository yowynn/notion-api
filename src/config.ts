import { config as dotenv_config } from 'dotenv';
dotenv_config();

const NOTION_TOKEN_V2 = process.env.NOTION_TOKEN_V2 as string;
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0';
const NOTION_BASE_URL = 'https://www.notion.so';
const NOTION_API_URL = `${NOTION_BASE_URL}/api/v3`;
const NOTION_CLIENT_VERSION = '23.13.0.320';
const DEBUG_MODE = !!process.env.DEBUG_MODE;

export const config = {
    NOTION_TOKEN_V2,
    USER_AGENT,
    NOTION_BASE_URL,
    NOTION_API_URL,
    NOTION_CLIENT_VERSION,
    DEBUG_MODE,
};
