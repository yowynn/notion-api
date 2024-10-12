import fetch from 'node-fetch';
import { config } from './config.js';
import { ArgumentError, ResponseError, UnsupportedError } from './error.js';
import { log } from './log.js';
import { read_from_stdin, stringify } from './util.js';

export class Session {
    private userAgent: string;
    private apiUrl: string;
    private _headers: Record<string, string> = {};
    private _cookies: Record<string, string> = {};

    public constructor(apiUrl: string, userAgent?: string) {
        this.apiUrl = apiUrl;
        this.userAgent = userAgent || config.USER_AGENT;
    }

    public get_cookie(name: string) {
        return this._cookies[name];
    }

    public set_cookie(name: string, value: string) {
        this._cookies[name] = value;
    }

    public clear_cookies() {
        this._cookies = {};
    }

    public get_header(name: string) {
        return this._headers[name];
    }

    public set_header(name: string, value: string) {
        this._headers[name] = value;
    }

    public clear_headers() {
        this._headers = {};
    }

    private get_cookie_string() {
        return Object.entries(this._cookies).map(([name, value]) => `${name}=${value}`).join('; ');
    }

    private get_headers() {
        return {
            'content-type': 'application/json; charset=utf-8',
            'user-agent': this.userAgent,
            'notion-client-version': config.NOTION_CLIENT_VERSION,
            cookie: this.get_cookie_string(),
            ...this._headers,
        };
    }

    public async request(path: string, body: any = {}): Promise<any> {
        log.info(`Requesting ${path}`);
        const response = await fetch(`${this.apiUrl}/${path}`, {
            method: 'POST',
            headers: this.get_headers(),
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            const text = stringify(await response.json());
            throw new ResponseError(path, response, text);
        }
        // set cookies
        const set_cookie = response.headers.get('set-cookie');
        if (set_cookie) {
            const cookies = set_cookie.split(',').map(x => x.split(';')?.[0]?.trim());
            for (const cookie of cookies) {
                const [name, value] = cookie.split('=');
                this.set_cookie(name, value);
            }
        }
        return await response.json() as any;
    }

    public async authorize_from_token(token_v2: string) {
        this.set_cookie('token_v2', token_v2);
        // request some api to get user_id
        const data = await this.request('getUserAnalyticsSettings');
        const user_id = data?.user_id as string;
        if (!user_id) {
            throw new ArgumentError('authorize_from_token', 'token', token_v2, 'Invalid token');
        }
        return { user_id, token_v2 };
    }

    public async authorize_from_login(email: string, password: string) {
        const loginOptions = await this.request('getLoginOptions', { email });
        if (!loginOptions.hasAccount) {
            throw new ArgumentError('authorize_from_login', 'email', email, 'Account does not exist');
        }
        if (loginOptions.mustReverify) {
            throw new UnsupportedError('authorize_from_login', 'mustReverify');
        }
        let user_id: string;
        if (loginOptions.passwordSignIn) {
            const loginData = await this.request('loginWithEmail', {
                email,
                password,
                loginOptionsToken: loginOptions.loginOptionsToken,
            });
            user_id = loginData.userId as string;
        }
        else {
            const temporaryState = await this.request('sendTemporaryPassword', {
                email,
                loginOptionsToken: loginOptions.loginOptionsToken,
                disableLoginLink: false,
                native: false,
                isSignup: false,
                shouldHidePasscode: false,
            });
            password = await read_from_stdin(`Input code from email sent to ${email}: `);
            const loginData = await this.request('loginWithEmail', {
                password,
                state: temporaryState.csrfState,
            });
            user_id = loginData.userId as string;
        }
        if (!user_id) {
            throw new UnsupportedError('authorize_from_login', 'unknown error during login');
        }
        return { user_id, token_v2: this.get_cookie('token_v2') };
    }
}
