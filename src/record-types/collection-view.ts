import {
    collection_page_property,
    i_deletable,
    i_editable,
    i_parented,
    i_versioned,
    pointer,
    string_icon,
    string_property_id,
    string_uuid,
} from '.';


/** Collection table property */
export type collection_view_table_property = {
    wrap?: boolean;                                             // Wrap or not, default: collection_view.format.table_wrap
    width?: number;                                             // Width (px), default: 200px
    visible: boolean;                                           // Visible or not
    property: string_property_id;                               // Refer: property
};

export type collection_view_table =
    & i_versioned
    & i_editable
    & i_deletable
    & i_parented
    & {
        type: 'table';
        name?: string;                                          // Collection view name
        format?: {
            table_wrap: boolean;                                // A switch to wrap all columns or not
            description?: string;                               // Collection view description
            show_page_icon?: boolean;
            table_properties:                                   // Table properties, in order //! LAZY UPDATE
            & Array<collection_view_table_property>;
            collection_pointer?: pointer;                       // Collection pointer, that may be not present, if it is the view in origin block (where the collection is created)
            collection_view_icon?: string_icon;                 // Collection view icon
            hide_table_vertical_lines?: boolean;                // Hide table vertical lines or not
            table_frozen_column_index?: number;                 // Frozen column index, -1 means no frozen column
            collection_page_properties?:
            & Array<collection_page_property>;                  // Collection page properties
            hide_linked_collection_name: boolean;               // Hide linked collection name or not
        };
        page_sort: Array<string_uuid>;                          // Page manual sort order  //! LAZY UPDATE
    };


export type collection_view =
    | collection_view_table
    ;

export type type_of_collection_view = collection_view['type'];
