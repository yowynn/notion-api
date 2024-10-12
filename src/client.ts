import { block } from './block.js';
import { NOTION_API_URL } from './config.js';
import * as log from './log.js';
import { RecordMap } from './record-map.js';
import { Session } from './session.js';
import { uuid } from './util.js';

export class Client {
    public static async from_token(token: string) {
        const client = new Client();
        const auth = await client.session.authorize_from_token(token);
        client._user_id = auth.user_id;
        log.info('Login success:', auth);
        return client;
    }

    public static async from_login(email: string, password: string) {
        const client = new Client();
        const auth = await client.session.authorize_from_login(email, password);
        client._user_id = auth.user_id;
        log.info('Login success:', auth);
        return client;
    }

    private _user_id!: string;
    public readonly session: Session;
    public readonly recordMap: RecordMap;

    public get user_id() {
        return this._user_id;
    }

    public get request() {
        return this.session.request.bind(this.session);
    }

    private constructor() {
        this.session = new Session(NOTION_API_URL);
        this.recordMap = new RecordMap(this);
    }

    public set_token(token: string) {
        this.session.set_cookie('token_v2', token);
    }

    public async get_block(id: string) {
        id = uuid(id);
        const record = await this.recordMap.get_record('block', id);
        const block_ = new block(id, this.recordMap);
        return block_;
    }

    public async get_space(id: string) {
        id = uuid(id);
        const space = await this.session.request('getSpace', { spaceId: id });
        return space;
    }

    public async get_user(id: string) {
        id = uuid(id);
        const user = await this.session.request('getUserAnalyticsData', { userId: id });
        return user;
    }

    public async get_collection(id: string) {
        id = uuid(id);
        const collection = await this.session.request('queryCollection', { collectionId: id });
        return collection;
    }

    public async get_collection_view(id: string) {
        id = uuid(id);
        const collection_view = await this.session.request('getCollectionView', { collectionId: id });
        return collection_view;
    }

    public async get_record_values(id: string) {
        id = uuid(id);
        const record_values = await this.session.request('getRecordValues', { requests: [{ id, table: 'block' }] });
        return record_values;
    }

    public async get_record_values2(ids: string[]) {
        const record_values = await this.session.request('getRecordValues', { requests: ids.map(id => ({ id, table: 'block' })) });
        return record_values;
    }

    public async search(params: any) {
        const search = await this.session.request('search', params);
        return search;
    }

    public async query_collection(params: any) {
        const query_collection = await this.session.request('queryCollection', params);
        return query_collection;
    }
}
