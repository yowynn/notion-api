import type * as rt from './record-types';
import type Block from './block.js';
import type CollectionView from './collection-view';
import type Collection from './collection';
import type { CollectionViewBlock } from './block.js';
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
    private _spaceId!: rt.string_uuid;
    private _inferedSpaceId!: rt.string_uuid;
    private _timezone!: rt.option_time_zone;
    public readonly _transactions: { [key: string]: Transation; } = {};
    public _transactionKey: string = 'default';
    public readonly version: string;
    public readonly session: Session;
    public readonly sessionApi: SessionApi;
    public readonly recordMap: RecordMap;
    public readonly action: Action;
    public readonly awsSession: Session;

    public get userId(): rt.string_uuid {
        return this._userId;
    }

    public get spaceId(): rt.string_uuid {
        return this._spaceId ?? this._inferedSpaceId;
    }

    public get timeZone(): rt.option_time_zone {
        return this._timezone;
    }

    public get transaction(): Transation {
        return this._transactions[this._transactionKey];
    }

    private constructor(version: string = config.NOTION_CLIENT_VERSION) {
        this.version = version;
        this.setTimezone(config.NOTION_DEFAULT_TIMEZONE as rt.option_time_zone);
        this.session = new Session(config.NOTION_API_URL);
        this.session.headers.set('content-type', 'application/json');
        this.session.headers.set('notion-client-version', this.version);

        this.sessionApi = new SessionApi(this, this.session);

        this.recordMap = new RecordMap(this);
        this._transactions[this._transactionKey] = new Transation(this);
        this.action = new Action(this);

        this.awsSession = new Session(config.AWS_UPLOAD_URL);
    }

    public selectSpace(id: rt.string_uuid) {
        this._spaceId = id;
    }

    public setTimezone(timezone: rt.option_time_zone) {
        this._timezone = timezone;
    }

    public beginTransaction(key: string | number = 'default', isSilent: boolean = false) {
        this._transactionKey = key.toString();
        if (!this._transactions[this._transactionKey]) {
            this._transactions[this._transactionKey] = new Transation(this);
        }
        this.transaction.begin(isSilent);
    }

    public async endTransaction(key: string | number = 'default', refreshRecords: boolean = true) {
        const strKey = key.toString();
        const transaction = this._transactions[strKey];
        if (!transaction) {
            throw new Error(`Transaction ${strKey} not found`);
        }
        await transaction.end(refreshRecords);
        if (strKey === this._transactionKey) {
            this._transactionKey = 'default';
        }
    }

    public async getRecord<T extends Record = Record>(table: rt.type_of_record, id: rt.string_uuid, update: boolean = false) {
        id = uuid(id);
        const r = await this.recordMap.get({ table, id, spaceId: this.spaceId }, update, true);
        if (!r) {
            throw new Error(`Record not found: ${table}, ${id}`);
        }
        this._inferedSpaceId = r.space_id ?? this._inferedSpaceId;
        const record = Record.wrap(this, r, table) as T;
        return record;
    }

    public async getBlock<T extends Block = Block>(id: rt.string_uuid, update: boolean = false) {
        return this.getRecord<T>('block', id, update);
    }

    public async createBlock(type: rt.type_of_block, where: 'before' | 'after' | 'child', anchorBlock: Record) {
        const pointer = await this.action.createBlock(type, where, anchorBlock.pointer);
        await this.action.done(true);
        const r = await this.recordMap.get(pointer);
        const block = Record.wrap(this, r, 'block') as Block;
        return block;
    }

    public async createCollection(type: rt.type_of_collection_view, where: 'before' | 'after' | 'child', anchorBlock: Block, inline: boolean = false) {
        const blockType: rt.type_of_block = inline ? 'collection_view' : 'collection_view_page';
        const blockPointer = await this.action.createBlock(blockType, where, anchorBlock.pointer);
        const collectionViewPointer = await this.action.createCollectionView(type, blockPointer);
        const collectionPointer = await this.action.createCollection(blockPointer, collectionViewPointer);
        await this.action.done(true);
        const r = await this.recordMap.get(collectionPointer);
        const collection = Record.wrap(this, r, 'collection') as Collection;
        return collection;
    }

    public async createImageBlockUploaded(filePath: string, where: 'before' | 'after' | 'child', anchorBlock: Record) {
        const blockPointer = await this.action.createBlock('image', where, anchorBlock.pointer);
        await this.action.done(true);
        const url = await this.action.uploadFile(blockPointer, filePath);
        await this.action.done(true);
        const r = await this.recordMap.get(blockPointer);
        const block = Record.wrap(this, r, 'block') as Block;
        return block;
    }

    public async createCustomEmojiUploaded(filePath: string, name?: string) {
        if (!name) {
            name = filePath.split(/[\\/]/).pop()!;
        }
        const url = await this.action.uploadFilePublic(filePath);
        const emojiPointer = await this.action.createCustomEmoji(name, url);
        await this.action.done(true);
        const r = await this.recordMap.get(emojiPointer);
        const emoji = Record.wrap(this, r, 'custom_emoji') as Record;
        return emoji;
    }

    public async queryCollection(record: Record, options?: any, returnType: 'all' | 'query' | 'count' = 'query') {
        let collectionViewPointer: rt.pointered<'collection_view'>;
        let collectionPointer: rt.pointered<'collection'>;
        switch (record.table) {
            case 'collection_view': {
                collectionViewPointer = record.pointer as rt.pointered<'collection_view'>;
                collectionPointer = (await (record as CollectionView).getCollection()).pointer;
                break;
            }
            case 'collection': {
                collectionPointer = record.pointer as rt.pointered<'collection'>;
                const block = await (record as Collection).getParent();
                const collectionView = await block.getView(0)!;
                collectionViewPointer = collectionView.pointer;
                break;
            }
            case 'block': {
                const collectionView = await (record as CollectionViewBlock).getView(0)!;
                collectionViewPointer = collectionView.pointer;
                collectionPointer = (await collectionView.getCollection()).pointer;
            }
            default:
                throw new Error(`Invalid record type: ${record.table}`);
        }
        const result = this.recordMap.getQueryedResult(collectionPointer, collectionViewPointer, options, returnType);
        return result;
    }
}
