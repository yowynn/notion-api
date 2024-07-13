import * as fs from 'fs';

function stringify(...args: any[]) {
    const new_args = args.map((item) => {
        switch (typeof item) {
            case 'object':
                return JSON.stringify(item, null, 4);
            default:
                return item;
        }
    });
    return new_args.join(' ');
}

export function info(...args: any[]) {
    console.log(stringify(...args));
}

export function warn(...args: any[]) {
    console.warn(stringify(...args));
}

export function write_json(path: string, data: any) {
    fs.writeFileSync(path, stringify(data));
}
