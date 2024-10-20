import {
    number_timestamp,
    number_version,
    string_uuid,
    type_of_record,
    pointer_to_record,
    option_color,
    rich_text,
} from '.';

export interface i_versioned {
    id: string_uuid;                                           // UUID
    version: number_version;                                   // Version
}

export interface i_copyable {
    format?: {
        copied_from_pointer: pointer_to_record;                 // Refer to the record that this record is duplicated from
    };
    copied_from?: string_uuid;                                  // the same as `format.copied_from_pointer.id`
}

export interface i_creatable {
    created_time: number_timestamp;                             // Created time
    created_by_table: type_of_record;                           // Created by record type
    created_by_id: string_uuid;                                 // Refer: record, created by whom
}

export interface i_editable {
    last_edited_time: number_timestamp;                         // Last edited time
    last_edited_by_table: type_of_record;                       // Last edited by record type
    last_edited_by_id: string_uuid;                             // Refer: record, last edited by whom
}

export interface i_deletable {
    alive: boolean;                                             // Alive or in trash
    moved_to_trash_time?: number_timestamp;                     // Moved to trash time
    moved_to_trash_table?: type_of_record;                      // Moved to trash by record type
    moved_to_trash_id?: string_uuid;                            // Refer: record, moved to trash by whom
}

export interface i_parented {
    parent_id: string_uuid;                                     // Refer: record, parent record
    parent_table: type_of_record;                               // Parent record type, almost 'block' or 'collection', sometimes 'team' or 'space'
    space_id?: string_uuid;                                     // Refer: space, the space where the block is located
}

export interface i_childed {
    content?: Array<string_uuid>;                               // Child records
}

export interface i_colored {
    format?: {
        block_color: option_color;                              // Block color
    };
}
export interface i_titled {
    properties?: {
        title: rich_text;                                       // Main text content visible
    };
}

export interface i_captioned {
    properties?: {
        caption: rich_text;                                     // Caption of the block
    };
}
