import { block } from './block.js';
import { config } from './config.js';
import { log } from './log.js';
import { new_record } from './record-factory.js';
import { RecordMap } from './record-map.js';
import { Session } from './session.js';
import { uuid } from './util.js';

export class Client {
    public static async from_token(token: string): Promise<Client> {
        const client = new Client();
        const auth = await client.session.authorize_from_token(token);
        client.user_id = auth.user_id;
        log.info('Login success:', auth);
        return client;
    }

    public static async from_login(email: string, password: string): Promise<Client> {
        const client = new Client();
        const auth = await client.session.authorize_from_login(email, password);
        client.user_id = auth.user_id;
        log.info('Login success:', auth);
        return client;
    }

    private _user_id!: string;
    public readonly session: Session;
    public readonly record_map: RecordMap;

    public get user_id() {
        return this._user_id;
    }

    private set user_id(value: string) {
        this._user_id = value;
    }

    private constructor() {
        this.session = new Session(config.NOTION_API_URL);
        this.record_map = new RecordMap(this);
    }

    public async request(path: string, body: any = {}): Promise<any> {
        return this.session.request(path, body);
    }

    public async get_block(id: string, loadPageChunk: boolean = true) {
        id = uuid(id);
        if (loadPageChunk) {
            await this.record_map.load_page_chunk(id);
        }
        const r = await this.record_map.get_record('block', id, !loadPageChunk);
        const block = new_record(this, r, 'block');
        return block as block;
    }
}
