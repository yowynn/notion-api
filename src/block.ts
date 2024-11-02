import type * as rt from './record-types';
import Record, { as_record, record_accessor, readonly_record_accessor } from './record.js';
import { decodeProperty, dp, encodeProperty, ep } from './converter.js';
import Collection from './collection.js';
import log from './log.js';
import CollectionView from './collection-view';

@as_record('block')
export default class Block extends Record {
    public get table() {
        return 'block' as rt.type_of_record;
    }

    @readonly_record_accessor('alive')
    public accessor inTrash!: boolean;

    @record_accessor('type')
    public accessor type!: rt.type_of_block;

    @record_accessor('properties.title', dp('title'), ep('title'))
    public accessor title!: string;

    @record_accessor('format.block_color')
    public accessor blockColor!: rt.option_color;

    @readonly_record_accessor('content', (x) => (x as any[] ?? []).length)
    public accessor childCount!: number;

    public async getParent<T = Record>() {
        var record = this.record as rt.i_parented;
        var parentRecord = await this.recordMap.get(this.parentPointer!);
        return Record.wrap(this._client, parentRecord, record.parent_table) as T;
    }

    public async getChild<T = Block>(index: number) {
        var record = this.record as any
        var childId = record.content?.[index];
        if (!childId) {
            return undefined as unknown as T;
        }
        var childRecord = await this.recordMap.get({ table: 'block', id: childId, spaceId: record.space_id });
        return Record.wrap(this._client, childRecord, 'block') as T;
    }

    public async getChildren<T = Block>() {
        var record = this.record as any
        var content: rt.string_uuid[] = record.content ?? [];
        var children = await this.recordMap.getList(content.map(id => ({ table: 'block', id })));
        return children.map(child => Record.wrap(this._client, child, 'block') as T);
    }

    public async delete() {
        await this._client.action.deleteRecord({ table: 'block', id: this.id});
    }
}

@as_record('block', 'text')
export class TextBlock extends Block { }

@as_record('block', 'header')
export class HeaderBlock extends Block {
    @record_accessor('format.toggleable')
    public accessor isToggle!: boolean;
}

@as_record('block', 'sub_header')
export class SubHeaderBlock extends Block {
    @record_accessor('format.toggleable')
    public accessor isToggle!: boolean;
}

@as_record('block', 'sub_sub_header')
export class SubSubHeaderBlock extends Block {
    @record_accessor('format.toggleable')
    public accessor isToggle!: boolean;
}

@as_record('block', 'to_do')
export class ToDoBlock extends Block {
    @record_accessor('properties.checked', dp('checkbox'), ep('checkbox'))
    public accessor isChecked!: boolean;
}

@as_record('block', 'bulleted_list')
export class BulletedListBlock extends Block {
    @record_accessor('format.bullet_list_format')
    public accessor listMarker!: rt.option_bullet_list_marker;
}

@as_record('block', 'numbered_list')
export class NumberedListBlock extends Block {
    @record_accessor('format.list_format')
    public accessor listMarker!: rt.option_numbered_list_marker;
}

@as_record('block', 'toggle')
export class ToggleBlock extends Block { }

@as_record('block', 'code')
export class CodeBlock extends Block {
    @record_accessor('properties.caption', dp('text'), ep('text'))
    public accessor caption!: string;

    @record_accessor('properties.language', dp('text'), ep('text'))
    public accessor language!: rt.option_code_language;

    @record_accessor('format.code_wrap')
    public accessor isWrap!: boolean;

}

@as_record('block', 'quote')
export class QuoteBlock extends Block {
    @record_accessor('format.quote_size', x => x === 'large', x => x ? 'large' : null)
    public accessor isLarge!: boolean;
}

@as_record('block', 'callout')
export class CalloutBlock extends Block {
    @record_accessor('format.page_icon')
    public accessor icon!: rt.string_icon;
}

@as_record('block', 'equation')
export class EquationBlock extends Block { }

@as_record('block', 'transclusion_container')
export class TransclusionContainerBlock extends Block { }

@as_record('block', 'transclusion_reference')
export class TransclusionReferenceBlock extends Block {
    @record_accessor('format.transclusion_reference_pointer')
    public accessor referencePointer!: rt.pointer;

    public async getOriginBlock() {
        var record = this.record as rt.block_transclusion_reference;
        var referencePointer = record.format.transclusion_reference_pointer;
        var referenceRecord = await this.recordMap.get(referencePointer);
        return Record.wrap(this._client, referenceRecord, 'block') as Block;
    }
}

@as_record('block', 'column_list')
export class ColumnListBlock extends Block { }

@as_record('block', 'column')
export class ColumnBlock extends Block { }

@as_record('block', 'table')
export class TableBlock extends Block {
    @record_accessor('format.table_block_row_header')
    public accessor hasRowHeader!: boolean;

    @record_accessor('format.table_block_column_header')
    public accessor hasColumnHeader!: boolean;

    @readonly_record_accessor('format.table_block_column_order', x => x.length)
    public accessor columnCount!: number;
}

@as_record('block', 'table_row')
export class TableRowBlock extends Block {
    public getProperty(id: rt.string_property_id, simple: boolean = false) {
        var record = this.record as rt.block_table_row;
        var property = record.properties[id];
        return decodeProperty('text', property, simple);
    }
}

@as_record('block', 'divider')
export class DividerBlock extends Block { }

@as_record('block', 'alias')
export class AliasBlock extends Block {
    @record_accessor('format.alias_pointer')
    public accessor referencePointer!: rt.pointer;

    public async getOriginBlock() {
        var record = this.record as rt.block_alias;
        var referencePointer = record.format.alias_pointer;
        var referenceRecord = await this.recordMap.get(referencePointer);
        return Record.wrap(this._client, referenceRecord, 'block') as Block;
    }
}

@as_record('block', 'image')
export class ImageBlock extends Block {
    @record_accessor('properties.caption', dp('text'), ep('text'))
    public accessor caption!: string;

    @record_accessor('properties.source', dp('text'), ep('text'))
    public accessor source!: rt.string_url;

    @record_accessor('properties.alt_text', dp('text'), ep('text'))
    public accessor altText!: string;

    @record_accessor('format.block_full_width')
    public accessor isFullWidth!: boolean;

    @record_accessor('format.block_page_width')
    public accessor isPageWidth!: boolean;
}

@as_record('block', 'page')
export class PageBlock extends Block {
    @record_accessor('format.page_icon')
    public accessor icon!: rt.string_icon;

    @record_accessor('format.page_cover')
    public accessor cover!: rt.string_url;

    @record_accessor('format.page_full_width')
    public accessor isFullWidth!: boolean;

    @record_accessor('format.page_small_text')
    public accessor isSmallText!: boolean;

    public async getProperty(id_name: rt.string_property_id | string, simple: boolean = false) {
        var record = this.record as rt.block_page;
        if (record.parent_table === 'collection') {
            const parent = await this.getParent<Collection>();
            const schemaType = parent.getSchema(id_name)?.type ?? 'text';
            const id = parent.getSchemaId(id_name);
            var value = this.get(['properties', id]);
            return decodeProperty(schemaType, value!, simple);
        }
    }

    public async setProperty(id_name: rt.string_property_id | string, value: any) {
        var record = this.record as rt.block_page;
        if (record.parent_table === 'collection') {
            const parent = await this.getParent<Collection>();
            const schemaType = parent.getSchema(id_name)?.type ?? 'text';
            const id = parent.getSchemaId(id_name);
            await this.set(['properties', id], encodeProperty(schemaType, value));
            if (schemaType === 'select' || schemaType === 'status') {
                parent.createSchemaOptions(id_name, value);
            }
            else if (schemaType === 'multi_select') {
                parent.createSchemaOptions(id_name, ...value);
            }
        }
    }

    public async appendFileUpload(id_name: rt.string_property_id | string, filePath: string) {
        var record = this.record as rt.block_page;
        if (record.parent_table === 'collection') {
            const parent = await this.getParent<Collection>();
            const schema = parent.getSchema(id_name);
            if (schema?.type !== 'file') {
                throw new Error('Property is not a file type');
            }
            const id = parent.getSchemaId(id_name);
            this.markDirty();
            const url = await this._client.action.updateFile(this.pointer as rt.pointered<'block'>, filePath, undefined, id);
            await this._client.action.done(true);
            return url;
        }
    }
}

@as_record('block', 'collection_view_page')
export class CollectionViewPageBlock extends Block {
    @readonly_record_accessor('format.collection_pointer')
    public accessor collectionPointer!: rt.pointered<'collection'>;

    async getCollection() {
        var collectionPointer = this.collectionPointer;
        if (collectionPointer) {
            var collectionRecord = await this.recordMap.get(collectionPointer);
            return Record.wrap(this._client, collectionRecord, 'collection') as Collection;
        }
        return undefined as unknown as Collection;
    }

    @readonly_record_accessor('view_ids', (x) => (x as any[] ?? []).length)
    public accessor collectionViewCount!: number;

    public async getCollectionView(index: number) {
        var record = this.record as rt.block_collection_view_page;
        var collectionViewId = record.view_ids[index];
        var collectionViewRecord = await this.recordMap.get({ table: 'collection_view', id: collectionViewId });
        return Record.wrap(this._client, collectionViewRecord, 'collection_view') as CollectionView;
    }

}

@as_record('block', 'collection_view')
export class CollectionViewBlock extends Block {
    @readonly_record_accessor('format.collection_pointer')
    public accessor collectionPointer!: rt.pointered<'collection'>;
    async getCollection() {
        var collectionPointer = this.collectionPointer;
        if (collectionPointer) {
            var collectionRecord = await this.recordMap.get(collectionPointer);
            return Record.wrap(this._client, collectionRecord, 'collection') as Collection;
        }
        return undefined as unknown as Collection;
    }

    @readonly_record_accessor('view_ids', (x) => (x as any[] ?? []).length)
    public accessor collectionViewCount!: number;

    public async getCollectionView(index: number) {
        var record = this.record as rt.block_collection_view_page;
        var collectionViewId = record.view_ids[index];
        var collectionViewRecord = await this.recordMap.get({ table: 'collection_view', id: collectionViewId });
        return Record.wrap(this._client, collectionViewRecord, 'collection_view') as CollectionView;
    }
}
