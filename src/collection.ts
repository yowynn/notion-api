import type * as rt from './record-types';
import type { CollectionViewBlock, CollectionViewPageBlock, PageBlock } from './block.js';
import Record, { as_record, record_accessor, readonly_record_accessor } from './record.js';
import Client from './client.js';
import { dp, ep } from './converter.js';
import { newPropertyId, newUuid } from './util.js';
import log from './log.js';
import CollectionView from './collection-view';


@as_record('collection')
export default class Collection extends Record {
    public override get table() {
        return 'collection' as 'collection';
    }

    public override get record(): rt.collection {
        return super.record as rt.collection;
    }

    public override get pointer(): rt.pointered<'collection'> {
        return super.pointer as rt.pointered<'collection'>;
    }

    private _schemaNameMap: { [key: string]: rt.string_property_id; } = {};
    private _schemaMap: { [key: string]: rt.schema; } = {};

    @record_accessor('name', dp('title'), ep('title'))
    public accessor title!: string;

    @record_accessor('description')
    public accessor description!: string;

    @record_accessor('icon')
    public accessor icon!: rt.string_icon;

    @record_accessor('cover')
    public accessor cover!: rt.string_uuid;

    public async getParent<T extends CollectionViewBlock | CollectionViewPageBlock = CollectionViewBlock>() {
        const parentPointer = this.parentPointer;
        if (!parentPointer) {
            return undefined as unknown as T;
        }
        await this.recordMap.get(parentPointer);
        return Record.wrap(this.client, parentPointer) as T;
    }

    public async getView<T extends CollectionView = CollectionView>(index: number = 0) {
        return await (await this.getParent())!.getView(index) as T;
    }

    public async getViews() {
        return await (await this.getParent())!.getViews();
    }

    public getSchemaId(id_name: rt.string_property_id | string) {
        return this._schemaNameMap[id_name] ?? id_name;
    }

    public getSchema(id_name: rt.string_property_id | string) {
        const schema = this._schemaMap[id_name];
        if (!schema) {
            throw new Error(`Schema "${id_name}" not found`);
        }
        return schema;
    }

    public async setSchema(id_name: rt.string_property_id | string, schema: rt.schema) {
        const id = this.getSchemaId(id_name);
        await this.set(['schema', id], schema);
    }


    public async createSchemas(...schemas: (Partial<rt.schema> & { type: rt.type_of_schema, name: string; })[]) {
        const args = schemas.reduce((acc, schema) => {
            acc[newPropertyId()] = schema;
            return acc;
        }, {} as any)
        this.markDirty();
        await this.client.action.updateField(this.pointer, ['schema'], args, true);
        await this.client.action.done(true);
        this.refreshSchemaNameMap();
    }

    public async createSchemaOptions(id_name: rt.string_property_id | string, ...options: (Partial<rt.select_option> & { value: string; } | string)[]) {
        var schema = this.getSchema(id_name);
        var schemaOptionValues = (((schema as any).options ?? []) as rt.select_option[]).map(x => x.value);
        const addedOptions: rt.select_option[] = [];
        for (let option of options) {
            let value: string;
            if (typeof option === 'string') {
                value = option;
                if (!schemaOptionValues.includes(value)) {
                    addedOptions.push({ id: newUuid(), collectionIds: [this.id], value });
                    schemaOptionValues.push(value);
                }
            }
            else {
                value = option.value;
                if (!schemaOptionValues.includes(value)) {
                    addedOptions.push({ id: newUuid(), collectionIds: [this.id], ...option });
                    schemaOptionValues.push(value);
                }
            }
        }
        if (addedOptions && addedOptions.length > 0) {
            this.markDirty();
            await this.client.action.appendSchemaOptions(this.pointer as rt.pointered<'collection'>, this.getSchemaId(id_name), addedOptions);
            await this.client.action.done(true);
            this.refreshSchemaNameMap();
        }
    }

    public async clearAllRecords(permanentlyDelete: boolean = false) {
        const pointerList = await this.getRecordPointers();
        await this.client.action.deleteBlocks(pointerList, permanentlyDelete);
        await this.client.action.done(true);
    }

    public async queryRecords(options: rt.collection_query_options = {}) {
        const record = this.record;
        const collectionPointer = this.pointer;
        const collectionViewPointer = (await this.getView(0))!.pointer;
        const idList = await this.recordMap.getQueryedResult(collectionPointer, collectionViewPointer, options, 'query') as rt.string_uuid[];
        const blockList = idList.map(id => Record.wrap(this.client, { id, table: 'block', spaceId: record.space_id })) as PageBlock[];
        return blockList;
    }

    public async getTemplatePointers() {
        const record = this.record;
        const templateList = record.template_pages ?? [];
        const pointerList: rt.pointered<'block'>[] = templateList.map(id => ({ table: 'block', id, spaceId: record.space_id }));
        return pointerList;
    }

    public async getRecordPointers(includeTemplate: boolean = false) {
        const record = this.record;
        const collectionPointer = this.pointer;
        const collectionViewPointer = (await (await this.getParent()).getView(0))!.pointer;
        let idList = await this.recordMap.getQueryedResult(collectionPointer, collectionViewPointer, { limit: 1 }, 'all') as rt.string_uuid[];
        if (!includeTemplate) {
            const templateList = record.template_pages ?? [];
            idList = idList.filter(id => !templateList.includes(id));
        }
        const pointerList: rt.pointered<'block'>[] = idList.map(id => ({ table: 'block', id, spaceId: record.space_id }));
        return pointerList;
    }

    public async getRecordCount(includeTemplate: boolean = false) {
        const collectionPointer = this.pointer;
        const collectionViewPointer = (await this.getView(0))!.pointer;
        let count = await this.recordMap.getQueryedResult(collectionPointer, collectionViewPointer, { limit: 1 }, 'count') as number;
        if (includeTemplate) {
            count += (this.record.template_pages ?? []).length;
        }
        return count;
    }

    public constructor(client: Client, record: rt.record) {
        super(client, record);
        this.refreshSchemaNameMap();
    }

    public override async refresh(): Promise<void> {
        await super.refresh();
        this.refreshSchemaNameMap();
    }

    private refreshSchemaNameMap() {
        this._schemaNameMap = {};
        this._schemaMap = {};
        const schemas = this.record.schema;
        for (const key in schemas) {
            this._schemaNameMap[schemas[key].name] = key;
            this._schemaMap[schemas[key].name] = schemas[key];
            this._schemaMap[key] = schemas[key];
        }
    }
}
