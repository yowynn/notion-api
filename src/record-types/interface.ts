import {
    number_timestamp,
    number_version,
    string_uuid,
    option_color,
    pointer,
    rich_text,
    type_of_record,
} from '.';

/** With id and version */
export interface i_versioned {
    id: string_uuid;                                            // UUID
    version: number_version;                                    // Version
}

/** With copied from information */
export interface i_copyable {
    format?: {
        copied_from_pointer: pointer;                           // Refer to the record that this record is duplicated from
    };
    copied_from?: string_uuid;                                  // the same as `format.copied_from_pointer.id`
}

/** With created information */
export interface i_creatable {
    created_time: number_timestamp;                             // Created time
    created_by_table: type_of_record;                           // Created by record type
    created_by_id: string_uuid;                                 // Refer: record, created by whom
    space_id?: string_uuid;                                     // Refer: space, the space where the block is located
}

/** With edited information */
export interface i_editable {
    last_edited_time: number_timestamp;                         // Last edited time
    last_edited_by_table: type_of_record;                       // Last edited by record type
    last_edited_by_id: string_uuid;                             // Refer: record, last edited by whom
    space_id?: string_uuid;                                     // Refer: space, the space where the block is located
}

/** With deleted information */
export interface i_deletable {
    alive: boolean;                                             // Alive or in trash
    moved_to_trash_time?: number_timestamp;                     // Moved to trash time
    moved_to_trash_table?: type_of_record;                      // Moved to trash by record type
    moved_to_trash_id?: string_uuid;                            // Refer: record, moved to trash by whom
    space_id?: string_uuid;                                     // Refer: space, the space where the block is located
}

/** With parent information */
export interface i_parented {
    parent_id: string_uuid;                                     // Refer: record, parent record
    parent_table: type_of_record;                               // Parent record type, almost 'block' or 'collection', sometimes 'team' or 'space'
    space_id?: string_uuid;                                     // Refer: space, the space where the block is located
}

/** With block children information */
export interface i_childed {
    content?: Array<string_uuid>;                               // Child records
    space_id?: string_uuid;                                     // Refer: space, the space where the block is located
}

/** With block color information */
export interface i_colored {
    format?: {
        block_color: option_color;                              // Block color
    };
}

/** With block title information */
export interface i_titled {
    properties?: {
        title: rich_text;                                       // Main text content visible
    };
}

/** With block caption information */
export interface i_captioned {
    properties?: {
        caption: rich_text;                                     // Caption of the block
    };
}
