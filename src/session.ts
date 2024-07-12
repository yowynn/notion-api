import fetch, { Response } from 'node-fetch';
import { ResponseError } from './error.js';
import { USER_AGENT } from './config.js';
import * as log from './log.js';

export class Session {
    private userAgent: string;
    private apiUrl: string;
    private _headers: Record<string, string> = {};
    private _cookies: Record<string, string> = {};

    constructor(apiUrl: string, userAgent?: string) {
        this.apiUrl = apiUrl;
        this.userAgent = userAgent || USER_AGENT;
    }

    public set_cookie(name: string, value: string) {
        this._cookies[name] = value;
    }

    public set_header(name: string, value: string) {
        this._headers[name] = value;
    }

    public clear_cookies() {
        this._cookies = {};
    }

    public clear_headers() {
        this._headers = {};
    }

    private get_cookie_string() {
        return Object.entries(this._cookies).map(([name, value]) => `${name}=${value}`).join('; ');
    }

    private get_header() {
        return {
            'content-type': 'application/json',
            'user-agent': this.userAgent,
            cookie: this.get_cookie_string(),
            ...this._headers,
        };
    }


    async request<T>(path: string, body: any): Promise<T> {
        // log.info(`Requesting ${path} with ${JSON.stringify(body)}`);
        log.info(`Requesting ${path}`);
        const response = await fetch(`${this.apiUrl}/${path}`, {
            method: 'POST',
            headers: this.get_header(),
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new ResponseError(path, response);
        }

        return await response.json() as any;
    }
}
