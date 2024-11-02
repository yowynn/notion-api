import * as fs from 'fs';

import { stringify } from './util.js';

function info(...args: any[]) {
    console.log(stringify(...args));
}

function warn(...args: any[]) {
    console.warn(stringify(...args));
}

function error(...args: any[]) {
    console.trace(...args);
}

function writeFile(path: string, data: any) {
    const parent = path.split(/[\\\/]/).slice(0, -1).join('/');
    if (parent !== '' && !fs.existsSync(parent)) {
        fs.mkdirSync(parent, {
            recursive: true,
        });
    }
    fs.writeFileSync(path, stringify(data));
}

const log = {
    info,
    warn,
    error,
    writeFile,
};

export default log;
