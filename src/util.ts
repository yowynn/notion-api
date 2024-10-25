import * as readline from 'readline';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import csv from 'csv-parser';

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

export async function readFile(path: string) {
    return fs.promises.readFile(path);
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
