import {
    i_copyable,
    i_creatable,
    i_deletable,
    i_parented,
    i_versioned,
    number_normalization,
    string_icon,
    string_property_id,
    string_url,
    string_uuid,
    page_section_visibility,
    rich_text,
    schema,
    pointer as pointer,
} from '.';

/** Collection property visibility */
export type property_visibility = {
    property: string_property_id;                               // Refer: property
    visibility:
    | 'show'                                                    // As property: always show
    | 'hide'                                                    // As property: always hide
    | 'hide_if_empty'                                           // As property: hide when empty
    | 'section'                                                 // As page section, see: collection_page_section
    ;
};

/** Collection page section */
export type collection_page_section = {
    section: string_property_id;                                // Refer: property
    visibility:
    | 'inline'                                                  // As page section: inline
    | 'minimal'                                                 // As page section: minimal
    ;
};

/** Collection page property */
export type collection_page_property = {
    visible: boolean;                                           // Visible or not
    property: string_property_id;                               // Refer: property
};

/** Collection base*/
type i_collection =
    & i_versioned
    & i_copyable
    & i_creatable
    & i_deletable
    & i_parented
    ;

/** Collection */
export type collection =
    & i_collection
    & {
        name?: rich_text;                                       // Collection name
        description?: rich_text;                                // Collection description
        schema: {
            [key: string_property_id]: schema;                  // Schema map
        };
        icon?: string_icon;                                     // Icon URL
        cover?: string_url;                                     // Cover URL
        format?: {
            layout_pointer?: pointer;                           // Refer: layout
            subitem_property?: string_property_id;              // Subitem property if opened subitem support
            property_visibility?: Array<property_visibility>;   // Property visibility
            page_section_visibility?: page_section_visibility;  // Visibilities of page sections
            collection_page_sections?:
            & Array<collection_page_section>;                   // Collection page sections
            collection_cover_position?: number_normalization;   // Collection cover position
            collection_page_properties?:
            & Array<collection_page_property>;                  // Collection page properties:
            collection_default_template: {
                template_page_id: string_uuid;                  // Refer: block, default template page //TODO original template page id in template store??
            };
        };
        template_pages: Array<string_uuid>;                     // Refer: block, template pages
        migrated: boolean;                                      // Migrated or not, 这个字段意思是：是否已经迁移了，迁移的意思是：是否已经将原来的collection_view迁移到了collection中
        deleted_schema: {
            [key: string_property_id]: schema;                  // Deleted schema map
        };
    };
