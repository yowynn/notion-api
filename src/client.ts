import type * as rt from './record-types.js';
import type block from './block.js';
import Record from './record.js';
import config from './config.js';
import log from './log.js';
import Session from './session.js';
import SessionApi from './session-api.js';
import RecordMap from './record-map.js';
import Transation from './transaction.js';
import Action from './action.js';
import { uuid } from './util.js';

export default class Client {
    public static async fromToken(token: string): Promise<Client> {
        const client = new Client();
        const userID = await client.session.authorizeFromToken(token);
        client._userID = userID;
        log.info('Login success:', userID);
        return client;
    }

    public static async fromLogin(email: string, password: string): Promise<Client> {
        const client = new Client();
        const userID = await client.session.authorizeFromLogin(email, password);
        client._userID = userID;
        log.info('Login success:', userID);
        return client;
    }

    private _userID!: rt.literal_uuid;
    public readonly version: string;
    public readonly session: Session;
    public readonly sessionApi: SessionApi;
    public readonly recordMap: RecordMap;
    public readonly transaction: Transation;
    public readonly action: Action;

    public get userID(): rt.literal_uuid {
        return this._userID;
    }

    private constructor(version: string = config.NOTION_CLIENT_VERSION) {
        this.version = version;
        this.session = new Session(config.NOTION_API_URL);
        this.session.headers['notion-client-version'] = this.version;
        this.sessionApi = new SessionApi(this.session);

        this.recordMap = new RecordMap(this);
        this.transaction = new Transation(this);
        this.action = new Action(this.transaction);
    }

    public async getBlock(id: string, loadPageChunk: boolean = true) {
        id = uuid(id);
        const r = await this.recordMap.get('block', id, true, loadPageChunk);
        const block = Record.new_record(this, r, 'block') as block;
        return block;
    }
}
