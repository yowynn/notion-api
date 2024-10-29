import type * as rt from './record-types';
import Record, { as_record, record_accessor, readonly_record_accessor } from './record.js';
import { decodeProperty, dp, ep } from './converter.js';
import Client from './client.js';
import { newPropertyId, newUuid } from './util.js';
import log from './log.js';


@as_record('collection')
export default class Collection extends Record {
    public get table() {
        return 'collection' as rt.type_of_record;
    }

    @record_accessor('name', dp('title'), ep('title'))
    public accessor title!: string;

    @record_accessor('description')
    public accessor description!: string;

    @record_accessor('icon')
    public accessor icon!: rt.string_icon;

    @record_accessor('cover')
    public accessor cover!: rt.string_uuid;

    public getSchemaId(id_name: rt.string_property_id | string) {
        const name = this.getSchema(id_name).name;
        return this._schemaNameMap[name];
    }

    public getSchema(id_name: rt.string_property_id | string) {
        const schema = this._schemaMap[id_name];
        if (!schema) {
            throw new Error(`Schema "${id_name}" not found`);
        }
        return schema;
    }

    public async setSchema(id_name: rt.string_property_id | string, schema: rt.schema) {
        this.markDirty();
        const id = this.getSchemaId(id_name);
        await this.set(['schema', id], schema);
    }


    public async createSchema(...schemas: (Partial<rt.schema> & { type: rt.type_of_schema, name: string; })[]) {
        const args = schemas.reduce((acc, schema) => {
            acc[newPropertyId()] = schema;
            return acc;
        }, {} as any)
        this.markDirty();
        await this._client.action.updateRecordProperty(this.pointer, ['schema'], args);
        await this._client.action.done(true);
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
            await this._client.action.appendSchemaOptions(this.pointer as rt.pointered<'collection'>, this.getSchemaId(id_name), addedOptions);
            await this._client.action.done(true);
            this.refreshSchemaNameMap();
        }
    }


    private _schemaNameMap: { [key: string]: rt.string_property_id; } = {};
    private _schemaMap: { [key: string]: rt.schema; } = {};
    private refreshSchemaNameMap() {
        this._schemaNameMap = {};
        this._schemaMap = {};
        const schemas = (this.record as rt.collection).schema;
        for (const key in schemas) {
            this._schemaNameMap[schemas[key].name] = key;
            this._schemaMap[schemas[key].name] = schemas[key];
            this._schemaMap[key] = schemas[key];
        }
    }

    public constructor(client: Client, record: rt.record) {
        super(client, record);
        this.refreshSchemaNameMap();
    }

    public async refresh(): Promise<void> {
        await super.refresh();
        this.refreshSchemaNameMap();
    }
}
