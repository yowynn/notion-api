import {
    i_versioned,
} from '.';

export type collection_view_table =
    & i_versioned
    & {
        type: 'table';
    }


export type collection_view =
    | collection_view_table
    ;

export type type_of_collection_view = collection_view['type'];
