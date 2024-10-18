import type { Response } from 'node-fetch';
export class ArgumentError extends Error {
    constructor(funcName: string, argName: string, argValue: any, additionalInfo?: string) {
        if (additionalInfo) {
            additionalInfo = ` (${additionalInfo})`;
        }
        else {
            additionalInfo = '';
        }
        super(`Invalid argument ${argName} in function ${funcName}: ${argValue}${additionalInfo}`);
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
