import type * as rt from './record-types';
import Record, { as_record, record_accessor, readonly_record_accessor } from './record.js';
import { decodeProperty, dp, ep } from './converter.js';
import Client from './client.js';
import { newPropertyId } from './util.js';
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

    public getSchemaId(name: string) {
        return this._schemaNameMap[name];
    }

    public getSchemaById(id: rt.string_property_id) {
        return (this.record as rt.collection).schema[id];
    }


    public getSchemaByName(name: string) {
        const id = this.getSchemaId(name);
        return this.getSchemaById(id);
    }

    public async setSchemaById(id: rt.string_property_id, schema: rt.schema) {
        await this.set(['schema', id], schema);
        await this.refresh();
    }

    public async setSchemaByName(name: string, schema: rt.schema) {
        const id = this.getSchemaId(name);
        await this.setSchemaById(id, schema);
    }

    public async createSchema(...schemas: rt.schema[]) {
        for (const schema of schemas) {
            await this.set(['schema', newPropertyId()], schema);
        }
        await this.refresh();
    }

    public constructor(client: Client, record: rt.record) {
        super(client, record);
        this.refreshSchemaNameMap();
    }

    public async refresh(): Promise<void> {
        await super.refresh();
        this.refreshSchemaNameMap();
    }

    private _schemaNameMap: { [key: string]: rt.string_property_id } = {};
    private refreshSchemaNameMap() {
        this._schemaNameMap = {};
        const schemas = (this.record as rt.collection).schema;
        for (const key in schemas) {
            // log.info('schema:', key, schemas[key].name);
            this._schemaNameMap[schemas[key].name] = key;
        }
    }

}
