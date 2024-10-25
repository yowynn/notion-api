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
import { get } from 'http';
import { CollectionViewBlock, CollectionViewPageBlock } from './block.js';

export default class Client {
    public static async fromToken(token: string): Promise<Client> {
        const client = new Client();
        const userId = await client.session.notionAuthorizeFromToken(token);
        client._userId = userId;
        log.info('Login success:', userId);
        return client;
    }

    public static async fromLogin(email: string, password: string): Promise<Client> {
        const client = new Client();
        const userId = await client.session.notionAuthorizeFromLogin(email, password);
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
    public readonly awsSession: Session;

    public get userId(): rt.string_uuid {
        return this._userId;
    }

    private constructor(version: string = config.NOTION_CLIENT_VERSION) {
        this.version = version;
        this.session = new Session(config.NOTION_API_URL);
        this.session.headers.set('content-type', 'application/json');
        this.session.headers.set('notion-client-version', this.version);

        this.sessionApi = new SessionApi(this.session);

        this.recordMap = new RecordMap(this);
        this.transaction = new Transation(this);
        this.action = new Action(this);

        this.awsSession = new Session(config.AWS_UPLOAD_URL);
    }

    public beginTransaction(isSilent: boolean = false) {
        this.transaction.begin(isSilent);
    }

    public async endTransaction(refreshRecords: boolean = false) {
        await this.transaction.end(refreshRecords);
    }

    public async getBlock<T extends Block = Block>(id: rt.string_uuid, loadPageChunk: boolean = true) {
        id = uuid(id);
        const r = await this.recordMap.get({ table: 'block', id }, true, loadPageChunk);
        const block = Record.wrap(this, r, 'block') as T;
        return block;
    }

    public async getRecord<T extends Record = Record>(table: rt.type_of_record, id: rt.string_uuid) {
        id = uuid(id);
        const r = await this.recordMap.get({ table, id }, true);
        const record = Record.wrap(this, r, table) as T;
        return record;
    }

    public async setRecordProperty(record: Record, path: string[], args: any) {
        await this.action.setRecordProperty(record.pointer, path, args);
        await this.action.done(true);
    }

    public async deleteRecord(record: Record) {
        await this.action.deleteRecord(record.pointer);
        await this.action.done(true);
    }

    public async createBlock(type: rt.type_of_block, where: 'before' | 'after' | 'child', anchorBlock: Record) {
        const pointer = await this.action.createBlock(type, where, anchorBlock.pointer);
        await this.action.done(true);
        const r = await this.recordMap.get(pointer);
        const block = Record.wrap(this, r, 'block') as Block;
        return block;
    }

    public async createCollectionBlock(type: rt.type_of_collection_view, where: 'before' | 'after' | 'child', anchorBlock: Block, inline: boolean = false) {
        const blockType: rt.type_of_block = inline ? 'collection_view' : 'collection_view_page';
        const blockPointer = await this.action.createBlock(blockType, where, anchorBlock.pointer);
        const collectionViewPointer = await this.action.createCollectionView(type, blockPointer);
        const collectionPointer = await this.action.createCollection(blockPointer);
        await this.action.done(true);
        const r = await this.recordMap.get(blockPointer);
        const block = Record.wrap(this, r, 'block') as Block;
        return inline ? block as CollectionViewBlock : block as CollectionViewPageBlock;
    }

    public async createImageBlockUploaded(filePath: string, where: 'before' | 'after' | 'child', anchorBlock: Record) {
        const blockPointer = await this.action.createBlock('image', where, anchorBlock.pointer);
        await this.action.done(true);
        const data = await this.action.updateFile(blockPointer, filePath);
        await this.action.done(true);
        const r = await this.recordMap.get(blockPointer);
        const block = Record.wrap(this, r, 'block') as Block;
        return block;
    }
}
