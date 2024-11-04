import type * as rt from './record-types';
import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

const config = {
    AWS_UPLOAD_URL              : 'https://s3.us-west-2.amazonaws.com',
    NOTION_CLIENT_VERSION       : '23.13.0.530',
    NOTION_URL                  : 'https://www.notion.so',
    NOTION_API_URL              : 'https://www.notion.so/api/v3',
    NOTION_CLIENT_USER_AGENT    : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36 Edg/129.0.0.0',
    NOTION_DEFAULT_TIMEZONE     : 'Asia/Shanghai' as rt.option_time_zone,
    DEBUG_MODE                  : !!process.env.DEBUG_MODE,
};

export default config;
