import {
    string_property_id,
    string_url,
    string_uuid,
    option_color,
    date,
    pointer,
} from '.';

/** Template variable type collection */
export type option_template_variable =
    | 'now'                                                     // Time when duplicated
    | 'today'                                                   // Date when duplicated
    | 'me'                                                      // User when duplicated
    ;

/** Annotation: bold */
export type annotation_bold = [
    'b',
];

/** Annotation: italic */
export type annotation_italic = [
    'i',
];

/** Annotation: underline */
export type annotation_underline = [
    '_',
];

/** Annotation: strikethrough */
export type annotation_strikethrough = [
    's',
];

/** Annotation: code */
export type annotation_code = [
    'c',
];

/** Annotation: equation (replace text with '⁍') */
export type annotation_equation = [
    'e',
    string,                                                     // Expression
];

/** Annotation: highlight */
export type annotation_highlight = [
    'h',
    option_color,                                               // Color
];

/** Annotation: link */
export type annotation_link = [
    'a',
    string_url,                                                 // URL
];

/** Annotation: user mention (replace text with '‣') */
export type annotation_user = [
    'u',
    string_uuid,                                                // Refer: notion_user
];

/** Annotation: date mention (replace text with '‣') */
export type annotation_date = [
    'd',
    date,                                                       // Date
];

/** Annotation: template variable mention (replace text with '‣') */
export type annotation_template_variable = [
    'tv',
    {
        type: option_template_variable,                         // Template variable type
    }
];

/** Annotation: page mention (replace text with '‣') */
export type annotation_page = [
    'p',
    string_uuid,                                                // Refer: block (page is a block)
    string_uuid?,                                               // Refer: space
];

/** Annotation: margin comment */
export type annotation_margin_comment = [
    'm',
    string_uuid,                                                // Refer: discussion (comment is a child of discussion)
];

/** Annotation: suggested annotation */
export type annotation_suggested_annotation = [
    'sa',
    string_uuid,                                                // Refer: discussion (suggestion is a child of discussion)
    annotation,                                                 // Annotation suggested to add
];

/** Annotation: suggested un-annotation */
export type annotation_suggested_unannotation = [
    'sua',
    string_uuid,                                                // Refer: discussion (suggestion is a child of discussion)
    annotation,                                                 // Annotation suggested to remove
];

/** Annotation: suggested insertion */
export type annotation_suggested_insertion = [
    'si',
    string_uuid,                                                // Refer: discussion (suggestion is a child of discussion)
];

/** Annotation: suggested removal */
export type annotation_suggested_removal = [
    'sr',
    string_uuid,                                                // Refer: discussion (suggestion is a child of discussion)
];

/** Annotation: formula property pointer (replace text with '‣'), just for formula property */
export type annotation_formula_property_pointer = [
    'fpp',
    {
        name: string,                                           // Property name
        property: string_property_id,                           // Refer: property
        collection: pointer,                                    // Refer: collection
    }
];

/** Annotation: custom emoji (replace text with '‣') */
export type annotation_custom_emoji = [
    'ce',
    string_uuid,                                                // Refer: custom_emoji
    string_uuid?,                                               // Refer: space
];

/** Annotation: link mention (replace text with '‣') */
export type annotation_link_mention = [
    'lm',
    {
        href: string_url,                                       // URL
        title: string,                                          // Title
        icon_url?: string_url,                                  // Icon URL
        description?: string,                                   // Description (at preview card)
        thumbnail_url?: string_url,                             // Thumbnail image url (at preview card)
    }
];

/** Annotation: external object instance, such as link to github (replace text with '‣') */
export type annotation_external_object_instance = [
    'eoi',
    string_uuid,                                                // Refer: another block typed 'external_object_instance'
];

/** Annotation */
export type annotation =
    | annotation_bold                                           // Bold
    | annotation_italic                                         // Italic
    | annotation_underline                                      // Underline
    | annotation_strikethrough                                  // Strikethrough
    | annotation_code                                           // Code
    | annotation_equation                                       // Equation
    | annotation_highlight                                      // Highlight
    | annotation_link                                           // Link
    | annotation_user                                           // User mention
    | annotation_date                                           // Date mention
    | annotation_template_variable                              // Template variable mention
    | annotation_page                                           // Page mention
    | annotation_margin_comment                                 // Margin comment
    | annotation_suggested_annotation                           // Suggested annotation
    | annotation_suggested_unannotation                         // Suggested un-annotation
    | annotation_suggested_insertion                            // Suggested insertion
    | annotation_suggested_removal                              // Suggested removal
    | annotation_formula_property_pointer                       // Formula property pointer
    | annotation_custom_emoji                                   // Custom emoji
    ;

/** Annotation tag collection */
export type mark_of_annotation = annotation[0];
