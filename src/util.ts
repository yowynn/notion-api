import type * as rt from './record-types';
import * as readline from 'readline';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import csv from 'csv-parser';
import { createRequire } from 'module';

import config from './config.js';
import { ArgumentError } from './error.js';
import log from './log.js';

export function pointerTo(idOrUrl: rt.string_uuid | rt.string_url, inferTable: rt.type_of_record | 'page' = 'block', spaceId?: rt.string_uuid): rt.pointer {
    let id = idOrUrl;
    let table: rt.type_of_record = inferTable === 'page' ? 'block' : inferTable;
    if (/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(id)) {    // most common case
        return { id, table, spaceId };
    }
    if (id.startsWith(config.NOTION_URL) || id.startsWith('/')) {
        // https://www.notion.so/yowynn/11f6b80204ff8079942affd53125f620?pvs=4#1306b80204ff8074b4f3c7a29bf248f8
        // https://www.notion.so/yowynn/1306b80204ff80ab9d46c162091e3752?v=1306b80204ff81fda9cb000c838bc26c&pvs=4
        // https://www.notion.so/yowynn/PARA-Dashboard-12d6b80204ff80cba08de44cf82f2b8d?pvs=4
        switch (inferTable) {
            case 'block': {
                id = id.split('#').slice(-1)[0].split('/').slice(-1)[0].split('?')[0].split('-').slice(-1)[0];
                break;
            }
            case 'page': {
                id = id.split('/').slice(-1)[0].split('?')[0].split('-').slice(-1)[0];
                break;
            }
            case 'collection_view': {
                id = id.match(/v=([a-fA-F0-9]{32})/i)?.[1] ?? '';
                if (!id) {
                    throw new ArgumentError('uuid', 'idOrUrl', idOrUrl);
                }
                break;
            }
            default: {
                throw new ArgumentError('uuid', 'table', inferTable);
            }
        }
    }
    if (/^[a-f0-9]{32}$/i.test(id)) {
        id = id.toLowerCase().replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5');
    }
    else if (/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(id)) {
        id = id.toLowerCase();
    }
    else {
        throw new ArgumentError('uuid', 'idOrUrl', idOrUrl);
    }
    return { id, table, spaceId };
}

export function newUuid() {
    return uuidv4();
}

// random string of 4 characters
export function newPropertyId(): string {
    const asciiVisibleMin = 33;
    const asciiVisibleMax = 126;
    const asciiVisibleRange = asciiVisibleMax - asciiVisibleMin;
    return String.fromCharCode(
        asciiVisibleMin + Math.floor(Math.random() * asciiVisibleRange),
        asciiVisibleMin + Math.floor(Math.random() * asciiVisibleRange),
        asciiVisibleMin + Math.floor(Math.random() * asciiVisibleRange),
        asciiVisibleMin + Math.floor(Math.random() * asciiVisibleRange),
    );

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

export async function readFile(path: string, asText: boolean = false) {
    const buffer = await fs.promises.readFile(path);
    return asText ? buffer.toString() : buffer;
}

export async function readCsv(filePath: string) {
    return new Promise<any[]>((resolve, reject) => {
        const results: any[] = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data: any) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (err: any) => reject(err));
    });
}

export function importJson(path: string, callerUrl?: string) {
    if (!callerUrl) {
        const root = process.cwd();
        callerUrl = 'file:///' + root.replace(/\\/g, '/') + '/';
    }
    callerUrl = callerUrl ?? process.cwd();
    const require = createRequire(callerUrl);
    return require(path);
}

export function wrapQueryFilter(filter: any[]) {
    if (filter) {
        return {
            operator: 'and',
            filters: filter.map((item) => item.filter),
        }
    }
    return undefined;
}


export function inferMimeType(path: string) {
    const ext = path.split('.').slice(-1)[0];
    switch (ext) {
        case 'png':
            return 'image/png';
        case 'jpg':
        case 'jpeg':
            return 'image/jpeg';
        case 'gif':
            return 'image/gif';
        case 'webp':
            return 'image/webp';
        case 'svg':
            return 'image/svg+xml';
        case 'pdf':
            return 'application/pdf';
        case 'mp4':
            return 'video/mp4';
        case 'webm':
            return 'video/webm';
        case 'mov':
            return 'video/quicktime';
        case 'mp3':
            return 'audio/mpeg';
        case 'wav':
            return 'audio/wav';
        case 'flac':
            return 'audio/flac';
        case 'ogg':
            return 'audio/ogg';
        default:
            return 'application/octet-stream';
    }
}
