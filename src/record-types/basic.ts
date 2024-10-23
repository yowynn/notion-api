import {
    annotation,
} from '.';

/** Version value, increment after modification */
export type number_version = number;

/** Timestamp value, milliseconds since 1970-01-01T00:00:00.000Z */
export type number_timestamp = number;

/** Normalization value, range from 0 to 1 */
export type number_normalization = number;

/** UUID value, 36 characters, 8-4-4-4-12 */
export type string_uuid = string;

/** Property ID, 4 characters, random */
export type string_property_id = string;

/** Emoji character */
export type string_emoji = string;

/** URL value, full url, or relative url base on 'https://www.notion.so' */
export type string_url = string;

/** Icon value, emoji or url */
export type string_icon = string_emoji | string_url;

/** File size value, such as '1.2MB' */
export type string_file_size = string;

/** Boolean option, yes or no */
export type option_boolean = 'Yes' | 'No';

/** Rich text */
export type rich_text = Array<[
    string,                                                     // Plain text
    Array<annotation>?,                                         // Annotations
]>;

export type rich_texted<T extends string> =
    & rich_text
    & [[T]];
