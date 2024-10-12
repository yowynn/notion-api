import { Response } from 'node-fetch';
export class ArgumentError extends Error {
    constructor(func_name: string, arg_name: string, arg_value: any, additional_info?: string) {
        if (additional_info) {
            additional_info = ` (${additional_info})`;
        }
        else {
            additional_info = '';
        }
        super(`Invalid argument ${arg_name} in function ${func_name}: ${arg_value}${additional_info}`);
        this.name = 'ArgumentError';
    }
}

export class ResponseError extends Error {
    constructor(path: string, response: Response, text: string) {
        super(`Error while requesting ${path}: <${response.status} ${response.statusText}> ${text}`);
        this.name = 'ResponseError';
    }
}

// todo 未实现的
export class UnsupportedError extends Error {
    constructor(where: string, feature: string) {
        super(`Unsupported feature at ${where}: ${feature}`);
        this.name = 'UnsupportedError';
    }
}

export class ReadonlyModificationError extends Error {
    constructor(kind: string, path: string) {
        super(`Cannot modify readonly ${kind}: ${path}`);
        this.name = 'ReadonlyModificationError';
    }
}
