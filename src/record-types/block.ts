import {
    i_captioned,
    i_childed,
    i_colored,
    i_copyable,
    i_creatable,
    i_deletable,
    i_editable,
    i_parented,
    i_titled,
    i_versioned,
    number_normalization,
    string_file_size,
    string_icon,
    string_property_id,
    string_url,
    string_uuid,
    option_boolean,
    option_color,
    pointer_to_record,
    rich_text,
    rich_texted,
} from '.';


/** Bullet list marker option */
export type option_bullet_list_marker =
    | 'disc'                                                    // •
    | 'circle'                                                  // ◦
    | 'square'                                                  // ▪
    ;

/** Numbered list type option */
export type option_numbered_list_marker =
    | 'numbers'                                                 // 1.
    | 'letters'                                                 // a.
    | 'roman'                                                   // i.
    ;

/** Code language option */
export type option_code_language = 'ABAP' | 'Agda' | 'Arduino' | 'Assembly' | 'Bash' | 'BASIC' | 'BNF' | 'C' | 'C#' | 'C++' | 'Clojure' | 'CoffeeScript' | 'Coq' | 'CSS' | 'Dart' | 'Dhall' | 'Diff' | 'Docker' | 'EBNF' | 'Elixir' | 'Elm' | 'Erlang' | 'F#' | 'Flow' | 'Fortran' | 'Gherkin' | 'GLSL' | 'Go' | 'GraphQL' | 'Groovy' | 'Haskell' | 'HTML' | 'Idris' | 'Java' | 'JavaScript' | 'JSON' | 'Julia' | 'Kotlin' | 'LaTeX' | 'Less' | 'Lisp' | 'LiveScript' | 'LLVM IR' | 'Lua' | 'Makefile' | 'Markdown' | 'Markup' | 'MATLAB' | 'Mathematica' | 'Mermaid' | 'Nix' | 'Notion Formula' | 'Objective-C' | 'OCaml' | 'Pascal' | 'Perl' | 'PHP' | 'Plain Text' | 'PowerShell' | 'Prolog' | 'Protobuf' | 'PureScript' | 'Python' | 'R' | 'Racket' | 'Reason' | 'Ruby' | 'Rust' | 'Sass' | 'Scala' | 'Scheme' | 'Scss' | 'Shell' | 'Solidity' | 'SQL' | 'Swift' | 'TOML' | 'TypeScript' | 'VB.Net' | 'Verilog' | 'VHDL' | 'Visual Basic' | 'WebAssembly' | 'XML' | 'YAML';

/** Code preview mode option */
export type option_code_preview_mode =
    | 'code'                                                    // Code only
    | 'preview'                                                 // Preview only
    | 'split_view'                                              // Code and Preview
    ;

/** Quote size option */
export type option_quote_size =
    | 'large'                                                   // Large visual size
    ;

/** Image alignment option */
export type option_embed_alignment =
    | 'left'                                                    // Left
    | 'center'                                                  // Center
    | 'right'                                                   // Right
    ;

/** Image mask option */
export type option_image_mask =
    | 'Circle'                                                  // Circle mask
    | 'None'                                                    // No mask (rectangle)
    ;

/** Measurement unit option */
export type option_measurement_unit =
    | '%'                                                       // Percentage
    ;

/** Page font option */
export type option_page_font =
    | null                                                      // Default
    | 'serif'                                                   // Serif
    | 'mono'                                                    // Monospace
    ;

/** Section comments option */
export type option_section_comments =
    | 'section_show'                                            // Expanded
    | 'section_hide'                                            // Off
    ;

/** Section backlinks option */
export type option_section_backlinks =
    | 'section_show'                                            // Expanded
    | 'section_hide'                                            // Off
    | 'section_collapsed'                                       // Collapsed (and show in popover)
    ;

/** Section margin comments option */
export type option_section_margin_comments =
    | 'inline'                                                  // Inline (default)
    | 'minimal'                                                 // Minimal
    ;

/** Float table of contents state option */
export type option_float_toc_state =
    | 'minimal'                                                 // Minimal
    | 'off'                                                     // Off
    ;

/** Image edit metadata (for local image cropping) */
export type image_edit_metadata = {
    crop: {                                                     // Crop data:
        x: number;                                              // X coordinate
        y: number;                                              // Y coordinate
        unit: option_measurement_unit;                          // Measurement unit
        width: number;                                          // Width
        height: number;                                         // Height
    };
    mask: option_image_mask;                                    // Mask
};

/** Visibilities of page sections */
export type page_section_visibility = {
    comments: option_section_comments;                          // Comments
    backlinks: option_section_backlinks;                        // Backlinks
    margin_comments: option_section_margin_comments;            // Margin comments
};

/** Block base */
type i_block =
    & i_versioned
    & i_copyable
    & i_creatable
    & i_editable
    & i_deletable
    & i_parented
    ;

/** Block: text */
export type block_text =
    & i_block
    & i_titled
    & i_childed
    & i_colored
    & {
        type: 'text';
    };

/**
 * Block: heading 1
 *
 * case 1: normal heading
 *
 * case 2: toggleable heading
 */
export type block_header = block_header_normal | block_header_toggleable;
type block_header_normal =
    & i_block
    & i_titled
    & i_colored
    & {
        type: 'header';
    };
type block_header_toggleable =
    & block_header_normal
    & i_childed
    & {
        format: {
            toggleable: true;                                   // Toggleable，and has children blocks
        };
    };

/**
 * Block: heading 2
 *
 * case 1: normal heading
 *
 * case 2: toggleable heading
 */
export type block_sub_header = block_sub_header_normal | block_sub_header_toggleable;
type block_sub_header_normal =
    & i_block
    & i_titled
    & i_colored
    & {
        type: 'sub_header';
    };
type block_sub_header_toggleable =
    & block_sub_header_normal
    & i_childed
    & {
        format: {
            toggleable: true;                                   // Toggleable，and has children blocks
        };
    };

/**
 * Block: heading 3
 *
 * case 1: normal heading
 *
 * case 2: toggleable heading
 */
export type block_sub_sub_header = block_sub_sub_header_normal | block_sub_sub_header_toggleable;
type block_sub_sub_header_normal =
    & i_block
    & i_titled
    & i_colored
    & {
        type: 'sub_sub_header';
    };
type block_sub_sub_header_toggleable =
    & block_sub_sub_header_normal
    & i_childed
    & {
        format: {
            toggleable: true;                                   // Toggleable，and has children blocks
        };
    };

/** Block: to-do */
export type block_to_do =
    & i_block
    & i_titled
    & i_childed
    & i_colored
    & {
        type: 'to_do';
        properties?: {
            checked?: rich_texted<option_boolean>;              // Checked status
        };
    };

/** Block: bulleted list */
export type block_bulleted_list =
    & i_block
    & i_titled
    & i_childed
    & i_colored
    & {
        type: 'bulleted_list';
        format?: {
            bullet_list_format: option_bullet_list_marker;      // Bullet list marker, default is 'disc', 'circle', 'square' cyclically
        };
    };

/** Block: numbered list */
export type block_numbered_list =
    & i_block
    & i_titled
    & i_childed
    & i_colored
    & {
        type: 'numbered_list';
        format?: {
            list_format: option_numbered_list_marker;           // Numbered list marker, default is 'numbers', 'letters', 'roman' cyclically
        };
    };

/** Block: toggle */
export type block_toggle =
    & i_block
    & i_titled
    & i_childed
    & i_colored
    & {
        type: 'toggle';
    };

/**
 * Block: code
 *
 * case 1: normal code
 *
 * case 2: mermaid code
 */
export type block_code = block_code_normal | block_code_mermaid;
type block_code_normal =
    & i_block
    & i_titled
    & i_captioned
    & i_colored
    & {
        type: 'code';
        properties: {
            language: rich_texted<option_code_language>;        // Code language
        };
        format?: {
            code_wrap?: boolean;                                // Code wrap or not
        };
    };
type block_code_mermaid =
    & block_code_normal
    & {
        format?: {
            code_preview_format?: option_code_preview_mode;     // Code preview mode
        };
    };

/** Block: quote */
export type block_quote =
    & i_block
    & i_titled
    & i_childed
    & i_colored
    & {
        type: 'quote';
        format?: {
            quote_size?: option_quote_size;                     // Quote size
        };
    };

/**
 * Block: callout
 *
 * case 1: callout version 1, with a visible title
 *
 * case 2: callout version 2, no title, only icon
 */
export type block_callout = block_callout_v1 | block_callout_v2;
type block_callout_base =
    & i_block
    & i_childed
    & i_colored
    & {
        type: 'callout';
        format?: {
            page_icon?: string_icon;                            // Callout icon
        };
    };
type block_callout_v1 =
    & block_callout_base
    & i_titled                                                  // with a line at head to show title
    ;
type block_callout_v2 =
    & block_callout_base
    & {
        format: {
            callout_version: 2;                                 // Callout version 2, without title
        };
    };

/** Block: equation */
export type block_equation =
    & i_block
    & i_titled
    & i_colored
    & {
        type: 'equation';
    };

/** Block: synced block (source) */
export type block_transclusion_container =
    & i_block
    & i_childed
    & {
        type: 'transclusion_container';
    };

/** Block: synced block (reference) */
export type block_transclusion_reference =
    & i_block
    & {
        type: 'transclusion_reference';
        format: {
            transclusion_reference_pointer: pointer_to_record;  // Refer to the block to be referenced
        };
    };

/** Block: columns (list) */
export type block_column_list =
    & i_block
    & i_childed                                                 // Children must be block_column
    & {
        type: 'column_list';
    };

/** Block: columns (column) */
export type block_column =
    & i_block
    & i_childed
    & {
        type: 'column';
        format?: {
            column_ratio?: number;                              // Column ratio, default is 1
        };
    };

/** Block: table */
export type block_table =
    & i_block
    & i_childed                                                 // Children must be block_table_row
    & {
        type: 'table';
        format: {
            table_block_row_header?: boolean;                   // With row header or not
            table_block_column_order: Array<string_property_id>;// Column order
            table_block_column_format?: Record<string_property_id, {
                color?: option_color;                           // Column color
                width?: number;                                 // Column width (px)
            }>;
            table_block_column_header?: boolean;                // With column header or not
        };
    };

/** Block: table (row) */
export type block_table_row =
    & i_block
    & i_colored                                                 // Row color
    & {
        type: 'table_row';
        properties: {
            [key in string_property_id]: rich_text;             // Cell content
        };
    };

/** Block: divider */
export type block_divider =
    & i_block
    & {
        type: 'divider';
    };

/** Block: link to page (block) */
export type block_alias =
    & i_block
    & {
        type: 'alias';
        format: {
            alias_pointer: pointer_to_record;                   // Refer to the block to be linked
        };
    };

/**
 * Block: image
 *
 * case 1: uploaded image
 *
 * case 2: external image
 */
export type block_image = block_image_uploaded | block_image_external;
type block_image_external =
    & i_block
    & i_captioned
    & i_colored
    & {
        type: 'image';
        properties?: {
            source: rich_texted<string_url>;                    // Image source URL
            alt_text?: rich_texted<string>;                     // Image alt text, for screen reader
        };
        format: {
            block_width?: number;                               // Visual image width (px)
            block_height?: number;                              // Visual image height (px)
            display_source: string_url;                         // Image source URL
            block_alignment?: option_embed_alignment;           // Image alignment, default is 'center'
            image_hyperlink?: string_url;                       // Image hyperlink
            block_full_width?: boolean;                         // Full width mode, width is always full and height is manually set
            block_page_width?: boolean;                         // Page width mode, width is always page width and height is automatically set
        };
    };
type block_image_uploaded =
    & block_image_external
    & i_titled                                                  // Image file name (download name, and upload name)
    & {
        properties: {
            title: rich_texted<string>;                         // Image file name
            size: rich_texted<string_file_size>;                // Image size
        };
        format: {
            original_source?: string_url;                       // Original image source URL, if image is edited
            block_aspect_ratio?: number;                        // Aspect ratio, height / width
            image_edit_metadata?: image_edit_metadata;          // Image edit metadata (for local image cropping)
            block_preserve_scale?: boolean;                     // Preserve image scale or not, always true
        };
    };

/** Block: page */
export type block_page =
    & i_block
    & i_titled
    & i_childed
    & i_colored
    & {
        type: 'page';
        properties?: {
            [key in string_property_id]: rich_text;             // Page properties
        }
        format?: {                                              // Format of block:
            site_id?: string_uuid;                              // Refer: site, if published to web
            page_font?: option_page_font;                       // Page font, default is 'default'
            page_icon?: string_icon;                            // Page icon
            page_cover?: string_url;                            // Page cover
            block_locked?: boolean;                             // Page locked or not
            block_locked_by?: string_uuid;                      // Refer: notion_user, the user who locked the page
            page_full_width?: boolean;                          // Full width mode, page width is automatically set to full width
            page_small_text?: boolean;                          // Small text mode, page text is smaller
            page_cover_position?: number_normalization;         // Page cover position, 0 is bottom, 1 is top, default is 0.5
            page_section_visibility?: page_section_visibility;  // Visibilities of page sections
            social_media_image_preview_url?: string_url;        // Social media image preview URL, auto-generated
            page_floating_table_of_contents?: {
                state: option_float_toc_state;                  // Float table of contents state
            };
        };
    };

/**
 * Block: database page / wiki page
 *
 * case 1: page of database
 *
 * case 2: page of wiki
 */
export type block_collection_view_page = block_collection_view_page_database | block_collection_view_page_wiki;
type block_collection_view_page_database =
    & i_block
    & i_colored
    & {
        type: 'collection_view_page';
        view_ids: Array<string_uuid>;                           // Refer: collection_view, collection view IDs
        collection_id: string_uuid;                             // Refer: collection, the original database
        format: {
            site_id?: string_uuid;                              // Refer: site, if published to web
            block_locked?: boolean;                             // Page locked or not
            block_locked_by?: string_uuid;                      // Refer: notion_user, the user who locked the page
            collection_pointer: pointer_to_record;              // Refer to the 'collection' record
            social_media_image_preview_url?: string_url;        // Social media image preview URL, auto-generated
        };
    };
type block_collection_view_page_wiki =
    & block_collection_view_page_database
    & i_titled                                                  // Home view page title, same to the collection record title
    & i_childed                                                 // Home view content blocks
    & {
        format: {
            app_id: string_uuid;                                // Refer: app (TODO: what is this?)
            app_uri_map: {                                      // (TODO: what is this?)
                'notion://wiki_collection': string_uuid;        // Refer: collection, the same as `collection_id`
            }
            app_config_uri: string_url;                         // like "notion://wiki_block" (TODO: what is this?)
        };
    };

/**
 * Block: database view / linked database view
 *
 * case 1: view of database
 *
 * case 2: view of linked database
 */
export type block_collection_view = block_collection_view_database | block_collection_view_linked_database;
type block_collection_view_base =
    & i_block
    & {
        type: 'collection_view';
        view_ids: Array<string_uuid>;                           // Refer: collection_view, collection view IDs
        format: {
            block_locked?: boolean;                             // Page locked or not
            block_locked_by?: string_uuid;                      // Refer: notion_user, the user who locked the page
            social_media_image_preview_url?: string_url;        // Social media image preview URL, auto-generated
        };
    };
type block_collection_view_database =
    & block_collection_view_base
    & {
        collection_id: string_uuid;                             // Refer: collection, only for original database
        format: {
            collection_pointer: pointer_to_record;              // Refer to the 'collection' record, only for original database
        };
    };
type block_collection_view_linked_database =
    & block_collection_view_base
    & i_titled                                                  // Link view page title
    & {
        format?: {
            page_icon?: string_icon;                            // Link view page icon
            page_cover?: string_url;                            // Link view page cover
            page_cover_position?: number_normalization;         // Link view page cover position
        };
    };

/** Block: bookmark */
export type block_bookmark =
    & i_block
    & i_titled
    & i_captioned
    & i_colored
    & {
        type: 'bookmark';
        properties: {
            link?: rich_texted<string_url>;                     // Web page URL
            title: rich_texted<string>;                         // Web page title
            description?: rich_texted<string>;                  // Web page description
        };
        format?: {
            bookmark_icon?: string_icon;                        // Web page icon
            bookmark_cover?: string_url;                        // Web page cover
        };
    };

/**
 * Block: file
 *
 * case 1: uploaded file
 *
 * case 2: external file
 */
export type block_file = block_file_uploaded | block_file_external;
type block_file_external =
    & i_block
    & i_titled
    & i_captioned
    & i_colored
    & {
        type: 'file';
        properties: {
            title: rich_texted<string>;                         // File name
            source: rich_texted<string_url>;                    // File source URL
        };
    };
type block_file_uploaded =
    & block_file_external
    & {
        properties: {
            size: rich_texted<string_file_size>;                // File size
        };
    };

/**
 * Block: embed
 *
 * case 1: uploaded embed
 *
 * case 2: external embed
 */
export type block_embed = block_embed_uploaded | block_embed_external;
type block_embed_external =
    & i_block
    & i_captioned
    & {
        type: 'embed';
        properties: {
            source: rich_texted<string_url>;                    // Embed source URL
        };
        format?: {
            block_width?: number;                               // Visual embed width (px)
            block_height?: number;                              // Visual embed height (px)
            block_alignment?: option_embed_alignment;           // Embed alignment, default is 'center'
            block_full_width?: boolean;                         // Full width mode, width is always full and height is manually set
            block_page_width?: boolean;                         // Page width mode, width is always page width and height is automatically set
            block_preserve_scale?: boolean;                     // Preserve embed scale or not
        };
    };
type block_embed_uploaded =
    & block_embed_external
    & i_titled                                                  // Embed file name
    & {
        properties: {
            size: rich_texted<string_file_size>;                // Embed file size
            title: rich_texted<string>;                         // Embed file name
        };
    };

/** Block */
export type block =
    | block_text                                                // Text
    | block_header                                              // Heading 1
    | block_sub_header                                          // Heading 2
    | block_sub_sub_header                                      // Heading 3
    | block_to_do                                               // To-do
    | block_bulleted_list                                       // Bulleted list
    | block_numbered_list                                       // Numbered list
    | block_toggle                                              // Toggle
    | block_code                                                // Code
    | block_quote                                               // Quote
    | block_callout                                             // Callout
    | block_equation                                            // Equation
    | block_transclusion_container                              // Synced block (source)
    | block_transclusion_reference                              // Synced block (reference)
    | block_column_list                                         // Columns (list)
    | block_column                                              // Columns (column)
    | block_table                                               // Table
    | block_table_row                                           // Table (row)
    | block_divider                                             // Divider
    | block_alias                                               // Link to page (block)
    | block_image                                               // Image
    | block_page                                                // Page
    | block_collection_view_page                                // Database page / wiki page
    | block_collection_view                                     // Database view / linked database view
    | block_bookmark                                            // Bookmark
    | block_file                                                // File
    | block_embed                                               // Embed
    ;

/** Block type collection */
export type type_of_block = block['type'];
