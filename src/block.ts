import { markdown2richtext, richtext2markdown } from './converter.js';
import { record_accessor, recordable } from './recordable.js';

export class block extends recordable {
    @record_accessor('alive')
    public accessor alive!: boolean;

    @record_accessor('type')
    public accessor type!: string;

    @record_accessor('properties.title', richtext2markdown, markdown2richtext)
    public accessor title!: string;
}

export class page_block extends block {
}
