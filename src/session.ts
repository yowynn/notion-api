import fetch, { Headers } from 'node-fetch';

import type * as rt from './record-types';
import config from './config.js';
import log from './log.js';
import { ArgumentError, ResponseError, UnsupportedError } from './error.js';
import { input } from './util.js';

export default class Session {
    private _baseUrl: rt.string_url;
    private _headers: Headers = new Headers();
    private _cookie: Record<string, string> = {};

    public constructor(baseUrl: rt.string_url) {
        this._baseUrl = baseUrl;
        this.headers.set('user-agent', config.NOTION_CLIENT_USER_AGENT);
    }

    public get cookie() {
        return this._cookie;
    }

    public get headers() {
        this._headers.set('cookie', this.cookieString);
        return this._headers;
    }

    private get cookieString() {
        return Object.entries(this._cookie).map(([name, value]) => `${name}=${value}`).join('; ');
    }

    public async request(method: string, endpoint: string, payload: any = {}): Promise<any> {
        const url = endpoint.startsWith('http') ? endpoint : `${this._baseUrl}/${endpoint}`;
        log.info(`requesting: ${url}`);
        let body: any;
        const payloadType = this.headers.get('content-type');
        if (payloadType?.includes('application/json')) {
            body = JSON.stringify(payload);
        }
        else {
            body = payload;
        }
        const response = await fetch(url, {
            method,
            headers: this.headers,
            body,
        });
        if (!response.ok) {
            const text = await response.text();
            console.log('error data:', body);
            throw new ResponseError(endpoint, response, text);
        }
        const setCookie = response.headers.get('set-cookie');
        if (setCookie) {
            const pairs = setCookie.split(',').map(x => x.split(';')![0]!.trim().split('='));
            for (const [name, value] of pairs) {
                this.cookie[name] = value;
            }
        }
        const contentType = response.headers.get('content-type');
        let data;
        if (contentType) {
            if (contentType.includes('application/json')) {
                data = await response.json();
            } else if (contentType.includes('text/html')) {
                data = await response.text();
            } else if (contentType.includes('application/octet-stream')) {
                data = await response.arrayBuffer();
            } else if (contentType.includes('multipart/form-data')) {
                data = await response.formData();
            } else {
                data = await response.text();
            }
        } else {
            data = await response.text();
        }
        return data;
    }

    public async notionAuthorizeFromToken(token: string) {
        this.cookie['token_v2'] = token;
        // request some api to get user_id
        const data = await this.request('POST', 'getUserAnalyticsSettings');
        const userId = data?.user_id as rt.string_uuid;
        if (!userId) {
            throw new ArgumentError('authorize_from_token', 'token', token, 'Invalid token');
        }
        return userId;
    }

    public async notionAuthorizeFromLogin(email: string, password: string) {
        const loginOptions = await this.request('POST', 'getLoginOptions', { email });
        if (!loginOptions.hasAccount) {
            throw new ArgumentError('authorize_from_login', 'email', email, 'Account does not exist');
        }
        if (loginOptions.mustReverify) {
            throw new UnsupportedError('authorize_from_login', 'mustReverify');
        }
        let userId: rt.string_uuid;
        if (loginOptions.passwordSignIn) {
            const loginData = await this.request('POST', 'loginWithEmail', {
                email,
                password,
                loginOptionsToken: loginOptions.loginOptionsToken,
            });
            userId = loginData.userId as rt.string_uuid;
        }
        else {
            const temporaryState = await this.request('POST', 'sendTemporaryPassword', {
                email,
                loginOptionsToken: loginOptions.loginOptionsToken,
                disableLoginLink: false,
                native: false,
                isSignup: false,
                shouldHidePasscode: false,
            });
            password = await input(`Input code from email sent to ${email}: `);
            const loginData = await this.request('POST', 'loginWithEmail', {
                password,
                state: temporaryState.csrfState,
            });
            userId = loginData.userId as rt.string_uuid;
        }
        if (!userId) {
            throw new UnsupportedError('authorize_from_login', 'unknown error during login');
        }
        return userId;
    }

    public async awsUploadFile(awsUploadEntry: any, blob: Blob) {
        const type = awsUploadEntry.type as string;
        if (type === 'POST') {
            awsUploadEntry.postHeaders?.forEach((header: any) => this.headers.set(header.name, header.value));
            const fields = awsUploadEntry.fields as Record<string, string>;
            const form = new FormData();
            for (const [name, value] of Object.entries(fields)) {
                form.append(name, value);
            }
            form.append('file', blob, fields['key'].split('/').pop()!);
            // this.headers.set('content-type', `multipart/form-data; boundary=${form.getBoundary()}`);
            await this.request('POST', awsUploadEntry.signedUploadPostUrl, form);
        }
        else if (type === 'PUT') {
            awsUploadEntry.putHeaders?.forEach((header: any) => this.headers.set(header.name, header.value));
            await this.request('PUT', awsUploadEntry.signedPutUrl, blob);
        }
    }
}
