import fetch from 'node-fetch';

import type * as rt from './record-types';
import config from './config.js';
import log from './log.js';
import { ArgumentError, ResponseError, UnsupportedError } from './error.js';
import { input } from './util.js';

export default class Session {
    private _baseUrl: rt.string_url;
    private _headers: Record<string, string> = {};
    private _cookie: Record<string, string> = {};

    public constructor(baseUrl: rt.string_url) {
        this._baseUrl = baseUrl;
        this.headers['content-type'] = 'application/json';
        this.headers['user-agent'] = config.NOTION_CLIENT_USER_AGENT;
    }

    public get cookie() {
        return this._cookie;
    }

    public get headers() {
        this._headers['cookie'] = this.cookieString;
        return this._headers;
    }

    private get cookieString() {
        return Object.entries(this._cookie).map(([name, value]) => `${name}=${value}`).join('; ');
    }

    public async request(method: string, endpoint: string, payload: object = {}): Promise<any> {
        log.info(`requesting: ${endpoint}`);
        const response = await fetch(`${this._baseUrl}/${endpoint}`, {
            method,
            headers: this.headers,
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            const text = await response.text();
            console.log('error data:', JSON.stringify(payload, null, 4));
            throw new ResponseError(endpoint, response, text);
        }
        const setCookie = response.headers.get('set-cookie');
        if (setCookie) {
            const pairs = setCookie.split(',').map(x => x.split(';')![0]!.trim().split('='));
            for (const [name, value] of pairs) {
                this.cookie[name] = value;
            }
        }
        return await response.json() as any;
    }

    public async authorizeFromToken(token: string) {
        this.cookie['token_v2'] = token;
        // request some api to get user_id
        const data = await this.request('POST', 'getUserAnalyticsSettings');
        const userId = data?.user_id as rt.string_uuid;
        if (!userId) {
            throw new ArgumentError('authorize_from_token', 'token', token, 'Invalid token');
        }
        return userId;
    }

    public async authorizeFromLogin(email: string, password: string) {
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
}
