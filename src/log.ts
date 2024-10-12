import * as fs from 'fs';
import { stringify } from './util.js';

export function info(...args: any[]) {
    console.log(stringify(...args));
}

export function warn(...args: any[]) {
    console.warn(stringify(...args));
}

export function write_json(path: string, data: any) {
    const parent = path.split(/[\\\/]/).slice(0, -1).join('/');
    if (parent !== '' && !fs.existsSync(parent)) {
        fs.mkdirSync(parent, {
            recursive: true,
        });
    }
    fs.writeFileSync(path, stringify(data));
}
