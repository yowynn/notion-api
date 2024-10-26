import {
    i_creatable,
    i_deletable,
    i_versioned,
    string_url,
    pointer_to_record,
} from '.';

/** Custom emoji base */
type i_custom_emoji =
    & i_versioned
    & i_creatable
    & i_deletable
    ;

/** Custom emoji */
export type custom_emoji =
    & i_custom_emoji
    & {
        name: string;                                           // Name
        url: string_url;                                        // URL
    };

export type pointer_to_custom_emoji = pointer_to_record & { type: 'custom_emoji' };
