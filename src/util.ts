import * as readline from 'readline';
import { v4 as uuidv4 } from 'uuid';

import config from './config.js';
import { ArgumentError } from './error.js';

export function uuid(idOrUrl: string) {
    let re = idOrUrl;
    if (/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(re)) {    // most common case
        return re;
    }
    if (re.startsWith(config.NOTION_URL)) {
        re = re.split('#').slice(-1)[0].split('/').slice(-1)[0].split('&p=').slice(-1)[0].split('?')[0].split('-').slice(-1)[0];
    }
    if (/^[a-f0-9]{32}$/i.test(re)) {
        return re.toLowerCase().replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5');
    }
    else if (/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(re)) {
        return re.toLowerCase();
    }
    else {
        throw new ArgumentError('uuid', 'idOrUrl', idOrUrl);
    }
}

export function newUuid() {
    return uuidv4();
}

export function stringify(...args: any[]) {
    const newArgs = args.map((item) => {
        switch (typeof item) {
            case 'object':
                return JSON.stringify(item, null, 4);
            default:
                return item;
        }
    });
    return newArgs.join(' ');
}

export async function input(prompt: string) {
    const data = await new Promise<string>(resolve => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.question(prompt, (data: string) => {
            rl.close();
            resolve(data);
        });
    });
    return data;
}
