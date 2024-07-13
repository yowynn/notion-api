import { RecordMap } from './record-map.js';
import { record_accessor, recordable } from './recordable.js';

export class block extends recordable {
    @record_accessor('alive')
    accessor alive!: boolean;

    @record_accessor('type')
    accessor type!: string;

    @record_accessor('properties.title')
    accessor title!: string;

}

export class page_block extends block {

}
