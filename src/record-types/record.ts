import {
    block,
    collection,
    collection_view,
    string_uuid,
} from '.';

/** Reference record pointer, pointer to a record with record type */
export type pointer_to_record = {
    id: string_uuid;                                           // Refer: record
    table: type_of_record;                              // Record type
    spaceId?: string_uuid;                                     // Refer: space, the space where the record is located
};


/** Record map */
export type map_of_record = Partial<Record<type_of_record, Record<string_uuid, record>>>;

/** Record */
export type record =
    | block                                                     // Block
    | collection_view                                           // Collection view
    | collection                                                // Collection
    ;

/** Record type collection */
export type type_of_record =
    | 'block'                                                   // Block
    | 'collection_view'                                         // Collection view
    | 'collection'                                              // Collection
    | 'discussion'                                              // Discussion
    | 'comment'                                                 // Comment
    | 'team'                                                    // Team
    | 'space'                                                   // Space
    | 'notion_user'                                             // Notion user
    | 'bot'                                                     // Bot
    | 'user_root'                                               // User root
    | 'user_settings'                                           // User settings
    | 'space_view'                                              // Space view
    | 'space_user'                                              // Space/user relation, witch id is '<space_id>|<user_id>'
    ;
