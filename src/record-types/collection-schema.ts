import {
    string_icon,
    string_property_id,
    string_uuid,
    option_color_foreground,
    option_date_format,
    option_time_format,
    pointer_to_record,
    rich_text,
} from '.';

/** Translate language option */
export type option_tranaslate_language =
    | 'english'                                                 // English
    | 'korean'                                                  // Korean
    | 'chinese (simplified)'                                    // Chinese (Simplified)
    | 'chinese (traditional)'                                   // Chinese (Traditional)
    | 'japanese'                                                // Japanese
    | 'spanish'                                                 // Spanish
    | 'russian'                                                 // Russian
    | 'french'                                                  // French
    | 'portuguese'                                              // Portuguese
    | 'german'                                                  // German
    | 'italian'                                                 // Italian
    | 'dutch'                                                   // Dutch
    | 'indonesian'                                              // Indonesian
    | 'filipino'                                                // Filipino
    | 'vietnamese'                                              // Vietnamese
    ;

/** Number format option */
type option_number_format =
    | "number"                                                  // Number
    | "number_with_commas"                                      // Number with commas
    | "percent"                                                 // Percent
    | "dollar"                                                  // US dollar (USD $: United States)
    | "australian_dollar"                                       // Australian dollar (AUD AU$: Australia)
    | "canadian_dollar"                                         // Canadian dollar (CAD CA$: Canada)
    | "singapore_dollar"                                        // Singapore dollar (SGD S$: Singapore)
    | "euro"                                                    // Euro (EUR €: European Union)
    | "pound"                                                   // Pound (GBP £: United Kingdom)
    | "yen"                                                     // Yen (JPY ¥: Japan)
    | "ruble"                                                   // Ruble (RUB ₽: Russia)
    | "rupee"                                                   // Rupee (INR ₹: India)
    | "won"                                                     // Won (KRW ₩: South Korea)
    | "yuan"                                                    // Yuan (CNY ¥: China)
    | "real"                                                    // Real (BRL R$: Brazil)
    | "lira"                                                    // Lira (TRY ₺: Turkey)
    | "rupiah"                                                  // Rupiah (IDR Rp: Indonesia)
    | "franc"                                                   // Franc (CHF Fr: Switzerland)
    | "hong_kong_dollar"                                        // Hong Kong dollar (HKD HK$: Hong Kong)
    | "new_zealand_dollar"                                      // New Zealand dollar (NZD NZ$: New Zealand)
    | "krona"                                                   // Krona (SEK kr: Sweden)
    | "norwegian_krone"                                         // Norwegian krone (NOK kr: Norway)
    | "mexican_peso"                                            // Mexican peso (MXN Mex$: Mexico)
    | "rand"                                                    // Rand (ZAR R: South Africa)
    | "new_taiwan_dollar"                                       // New Taiwan dollar (TWD NT$: Taiwan)
    | "danish_krone"                                            // Danish krone (DKK kr: Denmark)
    | "zloty"                                                   // Zloty (PLN zł: Poland)
    | "baht"                                                    // Baht (THB ฿: Thailand)
    | "forint"                                                  // Forint (HUF Ft: Hungary)
    | "koruna"                                                  // Koruna (CZK Kč: Czech Republic)
    | "shekel"                                                  // Shekel (ILS ₪: New Israeli)
    | "chilean_peso"                                            // Chilean peso (CLP CLP$: Chile)
    | "philippine_peso"                                         // Philippine peso (PHP ₱: Philippines)
    | "dirham"                                                  // Dirham (AED د.إ: United Arab Emirates)
    | "colombian_peso"                                          // Colombian peso (COP COL$: Colombia)
    | "riyal"                                                   // Riyal (SAR ر.س: Saudi Arabia)
    | "ringgit"                                                 // Ringgit (MYR RM: Malaysia)
    | "leu"                                                     // Leu (RON lei: Romania)
    | "argentine_peso"                                          // Argentine peso (ARS $: Argentina)
    | "uruguayan_peso"                                          // Uruguayan peso (UYU $: Uruguay)
    | "peruvian_sol"                                            // Peruvian sol (PEN S/: Peru)
    ;

/** Select sort option */
export type option_select_sort =
    | 'manual'                                                  // Manual
    | 'alphabetical'                                            // Alphabetical
    | 'reverse_alphabetical'                                    // Reverse alphabetical
    ;

export type option_rollup_aggregation =
    | 'show_original'                                           // Show original
    | 'show_unique'                                             // Show unique values
    | 'count'                                                   // Count: count all
    | 'count_values'                                            // Count: count values
    | 'unique'                                                  // Count: count unique values
    | 'empty'                                                   // Count: count empty
    | 'not_empty'                                               // Count: count not empty
    | 'checked'                                                 // Count: count checked (checkbox)
    | 'unchecked'                                               // Count: count unchecked (checkbox)
    | { operator: 'count_per_group'; groupName: status_group['name']; }     // Count: count per group (status)
    | 'percent_empty'                                           // Percent: percent empty
    | 'percent_not_empty'                                       // Percent: percent not empty
    | 'percent_checked'                                         // Percent: percent checked (checkbox)
    | 'percent_unchecked'                                       // Percent: percent unchecked (checkbox)
    | { operator: 'percent_per_group'; groupName: status_group['name']; }   // Percent: percent per group (status)
    | 'earliest_date'                                           // Date: earliest date (date)
    | 'latest_date'                                             // Date: latest date (date)
    | 'date_range'                                              // Date: date range (date)
    | 'sum'                                                     // More options: sum (number)
    | 'average'                                                 // More options: average (number)
    | 'median'                                                  // More options: median (number)
    | 'min'                                                     // More options: min (number)
    | 'max'                                                     // More options: max (number)
    | 'range'                                                   // More options: range, max - min (number)

/** Number show as */
export type number_show_as =
    | null                                                      // Number:
    | {
        type: 'bar';                                            // Bar:
        color: option_color_foreground;                         // Color
        maxValue: number;                                       // Max value to divide by
        showValue: boolean;                                     // Show value or not
    }
    | {
        type: 'ring';                                           // Ring:
        color: option_color_foreground;                         // Color
        maxValue: number;                                       // Max value to divide by
        showValue: boolean;                                     // Show value or not
    }

/** Select option */
export type select_option = {
    id: string_property_id;                                     // Select option id
    color?: option_color_foreground;                            // Color
    value: string;                                              // Name
    description?: string;                                       // Description
    collectionIds?: Array<string_uuid>;                         // Collection ids (What is this?)
}

/** Status group */
export type status_group = {
    id: string_property_id;                                     // Status group id
    name: 'To-do' | 'In progress' | 'Complete';                 // Name
    color: option_color_foreground;                             // Color
    optionIds: Array<string_property_id>;                       // Status option ids
}

type i_ai_inference = {
    auto_update_on_edit: boolean;                               // Auto update on edit
}


/** AI fill: summary */
export type ai_inference_summarize =
    & i_ai_inference
    & {
        type: 'summarize';
    };

/** AI fill: translate */
export type ai_inference_translate =
    & i_ai_inference
    & {
        type: 'translate';
        toLanguage: option_tranaslate_language;                 // To language
        targetProperties: Array<string_property_id>;            // Target properties
    };

/** AI fill: extract key info */
export type ai_inference_extract =
    & i_ai_inference
    & {
        type: 'extract';
        prompt: string;                                         // Prompt
    };

/** AI fill: custom */
export type ai_inference_custom =
    & i_ai_inference
    & {
        type: 'custom';
        prompt: string;                                         // Prompt
    };

/** AI fill: select */
export type ai_inference_select =
    & i_ai_inference
    & {
        type: 'select';
        prompt: string;                                         // Prompt
        add_options: boolean;                                   // Add options or not
    };

/** AI fill */
export type ai_inference =
    | ai_inference_summarize
    | ai_inference_translate
    | ai_inference_extract
    | ai_inference_custom
    ;

/** Type of AI fill */
export type type_of_ai_inference = ai_inference['type'];

type i_schema = {
    icon?: string_icon;                                         // Icon
    name: string;                                               // Name
    description?: string;                                       // Description
    hideByDefaultInUnconfiguredViews?: boolean;                 // Hide by default in unconfigured views
}

/** Schema: array, just for formula return type */
export type schema_array =
    & i_schema
    & {
        type: 'array';
        of: schema;                                             // Array of what
    };

/** Schema: unknown, just for formula return type */
export type schema_unknown =
    & i_schema
    & {
        type: 'unknown';
    };

/** Schema: title */
export type schema_title =
    & i_schema
    & {
        type: 'title';
    };

/** Schema: text */
export type schema_text =
    & i_schema
    & {
        type: 'text';
        ai_inference?: ai_inference;                            // AI fill
    };

/** Schema: number */
export type schema_number =
    & i_schema
    & {
        type: 'number';
        show_as?: number_show_as;                               // Show as
        number_format: option_number_format;                    // Number format
    };

/** Schema: select */
export type schema_select =
    & i_schema
    & {
        type: 'select';
        options: Array<select_option>;                          // Options
        auto_sort_options: option_select_sort;                  // Auto sort options
        select_ai_inference?: ai_inference_select;              // AI fill
    };

/** Schema: multi select */
export type schema_multi_select =
    & i_schema
    & {
        type: 'multi_select';
        options: Array<select_option>;                          // Options
        auto_sort_options: option_select_sort;                  // Auto sort options
        select_ai_inference?: ai_inference_select;              // AI fill
    };

/** Schema: status */
export type schema_status =
    & i_schema
    & {
        type: 'status';
        groups: Array<status_group>;                            // Status groups
        options: Array<select_option>;                          // Options
        defaultOption: string;                                  // Default option name (value)
    };

/** Schema: date */
export type schema_date =
    & i_schema
    & {
        type: 'date';
        date_format: option_date_format;                        // Date format
        time_format: option_time_format;                        // Time format
    };

/** Schema: person */
export type schema_person =
    & i_schema
    & {
        type: 'person';
        limit?: 1;                                              // Limit
        default?: 'created_by';                                 // Default
    };

/** Schema: files & media */
export type schema_file =
    & i_schema
    & {
        type: 'file';
    };

/** Schema: checkbox */
export type schema_checkbox =
    & i_schema
    & {
        type: 'checkbox';
    };

/** Schema: url */
export type schema_url =
    & i_schema
    & {
        type: 'url';
        show_full_url: boolean;                                 // Show full URL or not
    };

/** Schema: email */
export type schema_email =
    & i_schema
    & {
        type: 'email';
    };

/** Schema: phone */
export type schema_phone_number =
    & i_schema
    & {
        type: 'phone_number';
    };

/** Schema: formula */
export type schema_formula =
    & i_schema
    & {
        type: 'formula';
        version: 'v2';                                          // Version
        formula2: {
            code: rich_text;                                    // Code, with annotation.annotation_formula_property_pointer
            result_type: Omit<schema, keyof i_schema>;          // Result type
        }
    };

/** Schema: relation */
export type schema_relation =
    & i_schema
    & {
        type: 'relation';
        limit?: 1;                                              // Limit
        version: 'v2';                                          // Version
        property?: string_property_id;                          // Property of related collection, which is related to this collection
        autoRelate: {
            enabled: boolean;                                   // Enabled
        }
        collection_id: string_uuid;                             // Collection id
        collection_pointer: pointer_to_record;                  // Collection pointer
    };

/** Schema: rollup */
export type schema_rollup =
    & i_schema
    & {
        type: 'rollup';
        show_as?: number_show_as;                               // Show as
        aggregation?: option_rollup_aggregation;                // Aggregation
        target_property: string_property_id;                    // Target property, in target collection
        relation_property: string_property_id;                  // Relation property, in this collection
        target_property_type: type_of_schema;                   // Target property type
    };

/** Schema: created time */
export type schema_created_time =
    & i_schema
    & {
        type: 'created_time';
    };

/** Schema: created by */
export type schema_created_by =
    & i_schema
    & {
        type: 'created_by';
    };

/** Schema: last edited time */
export type schema_last_edited_time =
    & i_schema
    & {
        type: 'last_edited_time';
    };

/** Schema: last edited by */
export type schema_last_edited_by =
    & i_schema
    & {
        type: 'last_edited_by';
    };

/** Schema: id */
export type schema_id =
    & i_schema
    & {
        type: 'auto_increment_id';
    };

/** Schema: button */
export type schema_button =
    & i_schema
    & {
        type: 'button';
        automation_id: string_uuid;                             // Automation id
    };

/** Schema */
export type schema =
    | schema_array
    | schema_unknown
    | schema_title
    | schema_text
    | schema_number
    | schema_select
    | schema_multi_select
    | schema_status
    | schema_date
    | schema_person
    | schema_file
    | schema_checkbox
    | schema_url
    | schema_email
    | schema_phone_number
    | schema_formula
    | schema_relation
    | schema_rollup
    | schema_created_time
    | schema_created_by
    | schema_last_edited_time
    | schema_last_edited_by
    | schema_id
    | schema_button
    ;

/** Type of schema */
export type type_of_schema = schema['type'];

