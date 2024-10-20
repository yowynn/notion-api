import type * as rt from './record-types';
import type Block from './block.js';
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
        const userId = await client.session.authorizeFromToken(token);
        client._userId = userId;
        log.info('Login success:', userId);
        return client;
    }

    public static async fromLogin(email: string, password: string): Promise<Client> {
        const client = new Client();
        const userId = await client.session.authorizeFromLogin(email, password);
        client._userId = userId;
        log.info('Login success:', userId);
        return client;
    }

    private _userId!: rt.string_uuid;
    public readonly version: string;
    public readonly session: Session;
    public readonly sessionApi: SessionApi;
    public readonly recordMap: RecordMap;
    public readonly transaction: Transation;
    public readonly action: Action;

    public get userId(): rt.string_uuid {
        return this._userId;
    }

    private constructor(version: string = config.NOTION_CLIENT_VERSION) {
        this.version = version;
        this.session = new Session(config.NOTION_API_URL);
        this.session.headers['notion-client-version'] = this.version;
        this.sessionApi = new SessionApi(this.session);

        this.recordMap = new RecordMap(this);
        this.transaction = new Transation(this);
        this.action = new Action(this);
    }

    public beginTransaction(isSilent: boolean = false) {
        this.transaction.begin(isSilent);
    }

    public async endTransaction(refreshRecords: boolean = false) {
        await this.transaction.end(refreshRecords);
    }

    public async getBlock(id: string, loadPageChunk: boolean = true) {
        id = uuid(id);
        const r = await this.recordMap.get({ table: 'block', id }, true, loadPageChunk);
        const block = Record.wrap(this, r, 'block') as Block;
        return block;
    }

    public async createBlock(type: rt.type_of_block, where: 'before' | 'after' | 'child', anchorBlock: Block) {
        const ancherRecord = anchorBlock.record as rt.block;
        const pointer = await this.action.createRecordPlaceholder('block', type);
        switch (where) {
            case 'before': {
                const parentPointer = { table: ancherRecord.parent_table, id: ancherRecord.parent_id, spaceId: ancherRecord.space_id };
                await this.action.setRecordParent(pointer, parentPointer, -1, anchorBlock.id);
                break;
            }
            case 'after': {
                const parentPointer = { table: ancherRecord.parent_table, id: ancherRecord.parent_id, spaceId: ancherRecord.space_id };
                await this.action.setRecordParent(pointer, parentPointer, 1, anchorBlock.id);
                break;
            }
            case 'child': {
                const parentPointer = { table: anchorBlock.table, id: anchorBlock.id, spaceId: ancherRecord.space_id };
                await this.action.setRecordParent(pointer, parentPointer);
                break;
            }
        }
        const r = await this.recordMap.get(pointer);
        const block = Record.wrap(this, r, 'block') as Block;
        return block;
    }
}
