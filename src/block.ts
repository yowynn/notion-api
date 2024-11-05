import type * as rt from './record-types';
import type Collection from './collection.js';
import type CollectionView from './collection-view';
import Record, { as_record, record_accessor, readonly_record_accessor } from './record.js';
import { decodeProperty, dp, encodeProperty, ep } from './converter.js';
import log from './log.js';

@as_record('block')
export default class Block extends Record {
    public override get table() {
        return 'block' as 'block';
    }

    public override get record(): rt.block {
        return super.record as rt.block;
    }

    public override get pointer(): rt.pointered<'block'> {
        return super.pointer as rt.pointered<'block'>;
    }

    public override async delete(permanentlyDelete: boolean = false) {
        await this.client.action.deleteBlocks([this.pointer], permanentlyDelete);
    }

    @record_accessor('type')
    public accessor type!: rt.type_of_block;

    @record_accessor('properties.title', dp('title'), ep('title'))
    public accessor title!: string;

    @record_accessor('properties.title', dp('title', true), ep('title', true))
    public accessor titleText!: string;

    @record_accessor('format.block_color')
    public accessor blockColor!: rt.option_color;

    @readonly_record_accessor('alive')
    public accessor inTrash!: boolean;

    @readonly_record_accessor('content', (x) => (x as any[] ?? []).length)
    public accessor childCount!: number;

    public async getParent<T = Record>() {
        const parentPointer = this.parentPointer;
        if (!parentPointer) {
            return undefined as unknown as T;
        }
        await this.client.recordMap.get(parentPointer);
        return Record.wrap(this.client, parentPointer) as T;
    }

    public async getChild<T = Block>(index: number = 0) {
        const record = this.record as rt.i_childed;
        const id = record.content?.[index];
        if (!id) {
            return undefined as unknown as T;
        }
        const childPointer = { table: 'block', id, spaceId: record.space_id } as rt.pointered<'block'>;
        await this.client.recordMap.get(childPointer);
        return Record.wrap(this.client, childPointer) as T;
    }

    public async getChildren<T = Block>() {
        const record = this.record as rt.i_childed;
        const content: rt.string_uuid[] = record.content ?? [];
        const childPointerList: rt.pointer[] = content.map(id => ({ table: 'block', id, spaceId: record.space_id }));
        await this.recordMap.getList(childPointerList);
        return childPointerList.map(pointer => Record.wrap(this.client, pointer) as T);
    }
}

@as_record('block', 'text')
export class TextBlock extends Block {
    public override get record(): rt.block_text {
        return super.record as rt.block_text;
    }
}

@as_record('block', 'header')
export class HeaderBlock extends Block {
    public override get record(): rt.block_header {
        return super.record as rt.block_header;
    }

    @record_accessor('format.toggleable')
    public accessor isToggle!: boolean;
}

@as_record('block', 'sub_header')
export class SubHeaderBlock extends Block {
    public override get record(): rt.block_sub_header {
        return super.record as rt.block_sub_header;
    }

    @record_accessor('format.toggleable')
    public accessor isToggle!: boolean;
}

@as_record('block', 'sub_sub_header')
export class SubSubHeaderBlock extends Block {
    public override get record(): rt.block_sub_sub_header {
        return super.record as rt.block_sub_sub_header;
    }

    @record_accessor('format.toggleable')
    public accessor isToggle!: boolean;
}

@as_record('block', 'to_do')
export class ToDoBlock extends Block {
    public override get record(): rt.block_to_do {
        return super.record as rt.block_to_do;
    }

    @record_accessor('properties.checked', dp('checkbox'), ep('checkbox'))
    public accessor isChecked!: boolean;
}

@as_record('block', 'bulleted_list')
export class BulletedListBlock extends Block {
    public override get record(): rt.block_bulleted_list {
        return super.record as rt.block_bulleted_list;
    }

    @record_accessor('format.bullet_list_format')
    public accessor listMarker!: rt.option_bullet_list_marker;
}

@as_record('block', 'numbered_list')
export class NumberedListBlock extends Block {
    public override get record(): rt.block_numbered_list {
        return super.record as rt.block_numbered_list;
    }

    @record_accessor('format.list_format')
    public accessor listMarker!: rt.option_numbered_list_marker;
}

@as_record('block', 'toggle')
export class ToggleBlock extends Block {
    public override get record(): rt.block_toggle {
        return super.record as rt.block_toggle;
    }
}

@as_record('block', 'code')
export class CodeBlock extends Block {
    public override get record(): rt.block_code {
        return super.record as rt.block_code;
    }

    @record_accessor('properties.caption', dp('text'), ep('text'))
    public accessor caption!: string;

    @record_accessor('properties.language', dp('text', true), ep('text', true))
    public accessor language!: rt.option_code_language;

    @record_accessor('format.code_wrap')
    public accessor isWrap!: boolean;

}

@as_record('block', 'quote')
export class QuoteBlock extends Block {
    public override get record(): rt.block_quote {
        return super.record as rt.block_quote;
    }

    @record_accessor('format.quote_size', x => x === 'large', x => x ? 'large' : null)
    public accessor isLarge!: boolean;
}

@as_record('block', 'callout')
export class CalloutBlock extends Block {
    public override get record(): rt.block_callout {
        return super.record as rt.block_callout;
    }

    @record_accessor('format.page_icon')
    public accessor icon!: rt.string_icon;
}

@as_record('block', 'equation')
export class EquationBlock extends Block {
    public override get record(): rt.block_equation {
        return super.record as rt.block_equation;
    }
}

@as_record('block', 'transclusion_container')
export class TransclusionContainerBlock extends Block {
    public override get record(): rt.block_transclusion_container {
        return super.record as rt.block_transclusion_container;
    }
}

@as_record('block', 'transclusion_reference')
export class TransclusionReferenceBlock extends Block {
    public override get record(): rt.block_transclusion_reference {
        return super.record as rt.block_transclusion_reference;
    }

    @record_accessor('format.transclusion_reference_pointer')
    public accessor referencePointer!: rt.pointered<'block'>;

    public async getReference() {
        const referencePointer = this.referencePointer;
        await this.client.recordMap.get(referencePointer);
        return Record.wrap(this.client, referencePointer) as TransclusionContainerBlock;
    }
}

@as_record('block', 'column_list')
export class ColumnListBlock extends Block {
    public override get record(): rt.block_column_list {
        return super.record as rt.block_column_list;
    }

    @readonly_record_accessor('content', (x) => (x as any[] ?? []).length)
    public accessor columnCount!: number;

    public async getColumn(index: number = 0) {
        return await this.getChild<ColumnBlock>(index);
    }

    public async getColumns() {
        return await this.getChildren<ColumnBlock>();
    }
}

@as_record('block', 'column')
export class ColumnBlock extends Block {
    public override get record(): rt.block_column {
        return super.record as rt.block_column;
    }

    public async getColumnList() {
        return await this.getParent<ColumnListBlock>();
    }
}

@as_record('block', 'table')
export class TableBlock extends Block {
    public override get record(): rt.block_table {
        return super.record as rt.block_table;
    }

    @record_accessor('format.table_block_row_header')
    public accessor hasRowHeader!: boolean;

    @record_accessor('format.table_block_column_header')
    public accessor hasColumnHeader!: boolean;

    @readonly_record_accessor('format.table_block_column_order', x => x.length)
    public accessor columnCount!: number;

    @readonly_record_accessor('content', (x) => (x as any[] ?? []).length)
    public accessor rowCount!: number;

    public getSchemaId(id_index: rt.string_property_id | number) {
        if (typeof id_index === 'number') {
            const record = this.record;
            return record.format.table_block_column_order[id_index] as rt.string_property_id;
        }
        else {
            return id_index as rt.string_property_id;
        }
    }

    public async getTableRow(index: number = 0) {
        return await this.getChild<TableRowBlock>(index);
    }

    public async getTableRows() {
        return await this.getChildren<TableRowBlock>();
    }
}

@as_record('block', 'table_row')
export class TableRowBlock extends Block {
    public override get record(): rt.block_table_row {
        return super.record as rt.block_table_row;
    }

    public async getTable() {
        return await this.getParent<TableBlock>();
    }
    public async getProperty(id_index: rt.string_property_id | number, simple: boolean = false) {
        const id = (await this.getTable()).getSchemaId(id_index);
        const value = this.get(['properties', id]);
        return decodeProperty('text', value!, simple);
    }

    public async setProperty(id_index: rt.string_property_id | number, value: any, simple: boolean = false) {
        const id = (await this.getTable()).getSchemaId(id_index);
        await this.set(['properties', id], encodeProperty('text', value, simple));
    }
}

@as_record('block', 'divider')
export class DividerBlock extends Block {
    public override get record(): rt.block_divider {
        return super.record as rt.block_divider;
    }
}

@as_record('block', 'alias')
export class AliasBlock extends Block {
    public override get record(): rt.block_alias {
        return super.record as rt.block_alias;
    }

    @record_accessor('format.alias_pointer')
    public accessor referencePointer!: rt.pointered<'block'>;

    public async getReference() {
        const referencePointer = this.referencePointer;
        await this.client.recordMap.get(referencePointer);
        return Record.wrap(this.client, referencePointer) as Block;
    }
}

@as_record('block', 'image')
export class ImageBlock extends Block {
    public override get record(): rt.block_image {
        return super.record as rt.block_image;
    }

    @record_accessor('properties.caption', dp('text'), ep('text'))
    public accessor caption!: string;

    @record_accessor('properties.source', dp('text', true), ep('text', true))
    public accessor source!: rt.string_url;

    @record_accessor('properties.alt_text', dp('text', true), ep('text', true))
    public accessor altText!: string;

    @record_accessor('format.block_full_width')
    public accessor isFullWidth!: boolean;

    @record_accessor('format.block_page_width')
    public accessor isPageWidth!: boolean;
}

@as_record('block', 'page')
export class PageBlock extends Block {
    public override get record(): rt.block_page {
        return super.record as rt.block_page;
    }

    @record_accessor('format.page_icon')
    public accessor icon!: rt.string_icon;

    @record_accessor('format.page_cover')
    public accessor cover!: rt.string_url;

    @record_accessor('format.page_full_width')
    public accessor isFullWidth!: boolean;

    @record_accessor('format.page_small_text')
    public accessor isSmallText!: boolean;

    @readonly_record_accessor('parent_table', x => x === 'collection')
    public accessor isInCollection!: boolean;

    @readonly_record_accessor('is_template')
    public accessor isTemplate!: boolean;

    public async getCollection() {
        if (this.isInCollection) {
            const collection = await this.getParent<Collection>();
            return collection;
        }
        return undefined as unknown as Collection;
    }

    public async getProperty(id_name: rt.string_property_id | string, simple: boolean = false) {
        if (this.isInCollection) {
            const collection = await this.getCollection();
            const schemaType = collection.getSchema(id_name)?.type ?? 'text';
            const id = collection.getSchemaId(id_name);
            const value = this.get(['properties', id]);
            return decodeProperty(schemaType, value!, simple);
        }
        else {
            const value = this.get(['properties', id_name]);
            return decodeProperty('text', value, simple);
        }
    }

    public async setProperty(id_name: rt.string_property_id | string, value: any, simple: boolean = false) {
        if (this.isInCollection) {
            const collection = await this.getCollection();
            const schemaType = collection.getSchema(id_name)?.type ?? 'text';
            const id = collection.getSchemaId(id_name);
            await this.set(['properties', id], encodeProperty(schemaType, value, simple));
            if (schemaType === 'select' || schemaType === 'status') {
                collection.createSchemaOptions(id_name, value);
            }
            else if (schemaType === 'multi_select') {
                collection.createSchemaOptions(id_name, ...value);
            }
        }
        else {
            await this.set(['properties', id_name], encodeProperty('text', value, simple));
        }
    }

    public async appendFileUploaded(id_name: rt.string_property_id | string, filePath: string) {
        if (this.isInCollection) {
            const collection = await this.getCollection();
            const schema = collection.getSchema(id_name);
            if (schema?.type !== 'file') {
                throw new Error('Property is not a file type');
            }
            const id = collection.getSchemaId(id_name);
            this.markDirty();
            const url = await this.client.action.uploadFile(this.pointer, filePath, undefined, id);
            await this.client.action.done(true);
            return url;
        }
        else {
            throw new Error('Not in collection');
        }
    }

    public async appendPageRelated(id_name: rt.string_property_id | string, relatedPointer: rt.pointered<'block'>) {
        if (this.isInCollection) {
            const collection = await this.getCollection();
            const schema = collection.getSchema(id_name);
            if (schema?.type !== 'relation') {
                throw new Error('Property is not a relation type');
            }
            const id = collection.getSchemaId(id_name);
            this.markDirty();
            await this.client.action.appendRelations(this.pointer, id, [relatedPointer]);
            await this.client.action.done(true);
        }
    }
}

@as_record('block', 'collection_view_page')
export class CollectionViewPageBlock extends Block {
    public override get record(): rt.block_collection_view_page {
        return super.record as rt.block_collection_view_page;
    }

    @readonly_record_accessor('collection_id', x => !!x)
    public accessor isCollection!: boolean;

    @readonly_record_accessor('format.collection_pointer')
    private accessor collectionPointerCached!: rt.pointered<'collection'>;

    public get collectionPointer(): rt.pointered<'collection'> {
        let pointer = this.collectionPointerCached;
        if (pointer) {
            return pointer;
        }
        const record = this.record;
        if ('collection_id' in record) {
            return { table: 'collection', id: record.collection_id, spaceId: record.space_id };
        }
        return undefined as unknown as rt.pointered<'collection'>;
    }

    @readonly_record_accessor('view_ids', (x) => (x as any[] ?? []).length)
    public accessor viewCount!: number;

    public async getCollection() {
        if (this.isCollection) {
            const collectionPointer = this.collectionPointer;
            if (collectionPointer) {
                await this.client.recordMap.get(collectionPointer);
                return Record.wrap(this.client, collectionPointer) as Collection;
            }
            else {
                throw new Error('Collection not found');
            }
        }
        return undefined as unknown as Collection;
    }

    public async getView<T extends CollectionView = CollectionView>(index: number = 0) {
        const record = this.record;
        const collectionViewId = this.record.view_ids?.[index];
        if (collectionViewId) {
            const viewPointer = { table: 'collection_view', id: collectionViewId, spaceId: record.space_id } as rt.pointered<'collection_view'>;
            await this.client.recordMap.get(viewPointer);
            return Record.wrap(this.client, viewPointer) as T;
        }
        return undefined as unknown as T;
    }

    public async getViews<T extends CollectionView = CollectionView>() {
        const record = this.record;
        const collectionViewIds = this.record.view_ids ?? [];
        const collectionViewPointerList: rt.pointer[] = collectionViewIds.map(id => ({ table: 'collection_view', id, spaceId: record.space_id }));
        await this.recordMap.getList(collectionViewPointerList);
        return collectionViewPointerList.map(pointer => Record.wrap(this.client, pointer) as T);
    }
}

@as_record('block', 'collection_view')
export class CollectionViewBlock extends Block {
    public override get record(): rt.block_collection_view {
        return super.record as rt.block_collection_view;
    }

    @readonly_record_accessor('collection_id', x => !!x)
    public accessor isCollection!: boolean;

    @readonly_record_accessor('format.collection_pointer')
    public accessor collectionPointer!: rt.pointered<'collection'>;

    @readonly_record_accessor('view_ids', (x) => (x as any[] ?? []).length)
    public accessor viewCount!: number;

    public async getCollection() {
        if (this.isCollection) {
            const collectionPointer = this.collectionPointer;
            if (collectionPointer) {
                await this.client.recordMap.get(collectionPointer);
                return Record.wrap(this.client, collectionPointer) as Collection;
            }
            else {
                throw new Error('Collection not found');
            }
        }
        return undefined as unknown as Collection;
    }

    public async getView<T extends CollectionView = CollectionView>(index: number = 0) {
        const record = this.record;
        const collectionViewId = this.record.view_ids?.[index];
        if (collectionViewId) {
            const viewPointer = { table: 'collection_view', id: collectionViewId, spaceId: record.space_id } as rt.pointered<'collection_view'>;
            await this.client.recordMap.get(viewPointer);
            return Record.wrap(this.client, viewPointer) as T;
        }
        return undefined as unknown as T;
    }

    public async getViews<T extends CollectionView = CollectionView>() {
        const record = this.record;
        const collectionViewIds = this.record.view_ids ?? [];
        const collectionViewPointerList: rt.pointer[] = collectionViewIds.map(id => ({ table: 'collection_view', id, spaceId: record.space_id }));
        await this.recordMap.getList(collectionViewPointerList);
        return collectionViewPointerList.map(pointer => Record.wrap(this.client, pointer) as T);
    }
}
