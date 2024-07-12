import { Response } from 'node-fetch';
export class ArgumentError extends Error {
    constructor(func_name: string, arg_name: string, arg_value: any) {
        super(`Invalid argument ${arg_name} in function ${func_name}: ${arg_value}`);
        this.name = 'ArgumentError';
    }
}

export class ResponseError extends Error {
    constructor(path: string, response: Response) {
        super(`Error while requesting ${path}: ${response.status} ${response.statusText}`);
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
