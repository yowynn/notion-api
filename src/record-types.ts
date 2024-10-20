/** Version value, increment after modification */
export type literal_version = number;

/** Timestamp value, milliseconds since 1970-01-01T00:00:00.000Z */
export type literal_timestamp = number;

/** Normalization value, range from 0 to 1 */
export type literal_normalization_value = string;

/** UUID value, 36 characters, 8-4-4-4-12 */
export type literal_uuid = string;

/** Property ID, 4 characters, random */
export type literal_property_id = string;

/** Date value, YYYY-MM-DD */
export type literal_date = string;

/** Time value, HH:MM */
export type literal_time = string;

/** Emoji character */
export type literal_emoji = string;

/** URL value, full url, or relative url base on 'https://www.notion.so' */
export type literal_url = string;

/** Icon value, emoji or url */
export type literal_icon = literal_emoji | literal_url;

/** File size value, such as '1.2MB' */
export type literal_file_size = string;

/** Boolean option, yes or no */
export type option_boolean = 'Yes' | 'No';

/** Date format option */
export type option_date_format =
    | 'relative'                                                // Relative
    | 'MM/DD/YYYY'                                              // Month/Day/Year
    | 'DD/MM/YYYY'                                              // Day/Month/Year
    | 'YYYY/MM/DD'                                              // Year/Month/Day
    | 'll'                                                      // Full Date
    ;

/** Time format option */
export type option_time_format =
    | 'LT'                                                      // 12 hour
    | 'H:mm'                                                    // 24 hour
    | ' '                                                       // Hidden
    ;

/** Time zone option */
export type option_time_zone = 'Africa/Abidjan' | 'Africa/Accra' | 'Africa/Addis_Ababa' | 'Africa/Algiers' | 'Africa/Asmara' | 'Africa/Asmera' | 'Africa/Bamako' | 'Africa/Bangui' | 'Africa/Banjul' | 'Africa/Bissau' | 'Africa/Blantyre' | 'Africa/Brazzaville' | 'Africa/Bujumbura' | 'Africa/Cairo' | 'Africa/Casablanca' | 'Africa/Ceuta' | 'Africa/Conakry' | 'Africa/Dakar' | 'Africa/Dar_es_Salaam' | 'Africa/Djibouti' | 'Africa/Douala' | 'Africa/El_Aaiun' | 'Africa/Freetown' | 'Africa/Gaborone' | 'Africa/Harare' | 'Africa/Johannesburg' | 'Africa/Juba' | 'Africa/Kampala' | 'Africa/Khartoum' | 'Africa/Kigali' | 'Africa/Kinshasa' | 'Africa/Lagos' | 'Africa/Libreville' | 'Africa/Lome' | 'Africa/Luanda' | 'Africa/Lubumbashi' | 'Africa/Lusaka' | 'Africa/Malabo' | 'Africa/Maputo' | 'Africa/Maseru' | 'Africa/Mbabane' | 'Africa/Mogadishu' | 'Africa/Monrovia' | 'Africa/Nairobi' | 'Africa/Ndjamena' | 'Africa/Niamey' | 'Africa/Nouakchott' | 'Africa/Ouagadougou' | 'Africa/Porto-Novo' | 'Africa/Sao_Tome' | 'Africa/Timbuktu' | 'Africa/Tripoli' | 'Africa/Tunis' | 'Africa/Windhoek' | 'America/Adak' | 'America/Anchorage' | 'America/Anguilla' | 'America/Antigua' | 'America/Araguaina' | 'America/Argentina/Buenos_Aires' | 'America/Argentina/Catamarca' | 'America/Argentina/ComodRivadavia' | 'America/Argentina/Cordoba' | 'America/Argentina/Jujuy' | 'America/Argentina/La_Rioja' | 'America/Argentina/Mendoza' | 'America/Argentina/Rio_Gallegos' | 'America/Argentina/Salta' | 'America/Argentina/San_Juan' | 'America/Argentina/San_Luis' | 'America/Argentina/Tucuman' | 'America/Argentina/Ushuaia' | 'America/Aruba' | 'America/Asuncion' | 'America/Atikokan' | 'America/Atka' | 'America/Bahia' | 'America/Bahia_Banderas' | 'America/Barbados' | 'America/Belem' | 'America/Belize' | 'America/Blanc-Sablon' | 'America/Boa_Vista' | 'America/Bogota' | 'America/Boise' | 'America/Buenos_Aires' | 'America/Cambridge_Bay' | 'America/Campo_Grande' | 'America/Cancun' | 'America/Caracas' | 'America/Catamarca' | 'America/Cayenne' | 'America/Cayman' | 'America/Chicago' | 'America/Chihuahua' | 'America/Ciudad_Juarez' | 'America/Coral_Harbour' | 'America/Cordoba' | 'America/Costa_Rica' | 'America/Creston' | 'America/Cuiaba' | 'America/Curacao' | 'America/Danmarkshavn' | 'America/Dawson' | 'America/Dawson_Creek' | 'America/Denver' | 'America/Detroit' | 'America/Dominica' | 'America/Edmonton' | 'America/Eirunepe' | 'America/El_Salvador' | 'America/Ensenada' | 'America/Fort_Nelson' | 'America/Fort_Wayne' | 'America/Fortaleza' | 'America/Glace_Bay' | 'America/Godthab' | 'America/Goose_Bay' | 'America/Grand_Turk' | 'America/Grenada' | 'America/Guadeloupe' | 'America/Guatemala' | 'America/Guayaquil' | 'America/Guyana' | 'America/Halifax' | 'America/Havana' | 'America/Hermosillo' | 'America/Indiana/Indianapolis' | 'America/Indiana/Knox' | 'America/Indiana/Marengo' | 'America/Indiana/Petersburg' | 'America/Indiana/Tell_City' | 'America/Indiana/Vevay' | 'America/Indiana/Vincennes' | 'America/Indiana/Winamac' | 'America/Indianapolis' | 'America/Inuvik' | 'America/Iqaluit' | 'America/Jamaica' | 'America/Jujuy' | 'America/Juneau' | 'America/Kentucky/Louisville' | 'America/Kentucky/Monticello' | 'America/Knox_IN' | 'America/Kralendijk' | 'America/La_Paz' | 'America/Lima' | 'America/Los_Angeles' | 'America/Louisville' | 'America/Lower_Princes' | 'America/Maceio' | 'America/Managua' | 'America/Manaus' | 'America/Marigot' | 'America/Martinique' | 'America/Matamoros' | 'America/Mazatlan' | 'America/Mendoza' | 'America/Menominee' | 'America/Merida' | 'America/Metlakatla' | 'America/Mexico_City' | 'America/Miquelon' | 'America/Moncton' | 'America/Monterrey' | 'America/Montevideo' | 'America/Montreal' | 'America/Montserrat' | 'America/Nassau' | 'America/New_York' | 'America/Nipigon' | 'America/Nome' | 'America/Noronha' | 'America/North_Dakota/Beulah' | 'America/North_Dakota/Center' | 'America/North_Dakota/New_Salem' | 'America/Nuuk' | 'America/Ojinaga' | 'America/Panama' | 'America/Pangnirtung' | 'America/Paramaribo' | 'America/Phoenix' | 'America/Port-au-Prince' | 'America/Port_of_Spain' | 'America/Porto_Acre' | 'America/Porto_Velho' | 'America/Puerto_Rico' | 'America/Punta_Arenas' | 'America/Rainy_River' | 'America/Rankin_Inlet' | 'America/Recife' | 'America/Regina' | 'America/Resolute' | 'America/Rio_Branco' | 'America/Rosario' | 'America/Santa_Isabel' | 'America/Santarem' | 'America/Santiago' | 'America/Santo_Domingo' | 'America/Sao_Paulo' | 'America/Scoresbysund' | 'America/Shiprock' | 'America/Sitka' | 'America/St_Barthelemy' | 'America/St_Johns' | 'America/St_Kitts' | 'America/St_Lucia' | 'America/St_Thomas' | 'America/St_Vincent' | 'America/Swift_Current' | 'America/Tegucigalpa' | 'America/Thule' | 'America/Thunder_Bay' | 'America/Tijuana' | 'America/Toronto' | 'America/Tortola' | 'America/Vancouver' | 'America/Virgin' | 'America/Whitehorse' | 'America/Winnipeg' | 'America/Yakutat' | 'America/Yellowknife' | 'Antarctica/Casey' | 'Antarctica/Davis' | 'Antarctica/DumontDUrville' | 'Antarctica/Macquarie' | 'Antarctica/Mawson' | 'Antarctica/McMurdo' | 'Antarctica/Palmer' | 'Antarctica/Rothera' | 'Antarctica/South_Pole' | 'Antarctica/Syowa' | 'Antarctica/Troll' | 'Antarctica/Vostok' | 'Arctic/Longyearbyen' | 'Asia/Aden' | 'Asia/Almaty' | 'Asia/Amman' | 'Asia/Anadyr' | 'Asia/Aqtau' | 'Asia/Aqtobe' | 'Asia/Ashgabat' | 'Asia/Ashkhabad' | 'Asia/Atyrau' | 'Asia/Baghdad' | 'Asia/Bahrain' | 'Asia/Baku' | 'Asia/Bangkok' | 'Asia/Barnaul' | 'Asia/Beirut' | 'Asia/Bishkek' | 'Asia/Brunei' | 'Asia/Calcutta' | 'Asia/Chita' | 'Asia/Choibalsan' | 'Asia/Chongqing' | 'Asia/Chungking' | 'Asia/Colombo' | 'Asia/Dacca' | 'Asia/Damascus' | 'Asia/Dhaka' | 'Asia/Dili' | 'Asia/Dubai' | 'Asia/Dushanbe' | 'Asia/Famagusta' | 'Asia/Gaza' | 'Asia/Harbin' | 'Asia/Hebron' | 'Asia/Ho_Chi_Minh' | 'Asia/Hong_Kong' | 'Asia/Hovd' | 'Asia/Irkutsk' | 'Asia/Istanbul' | 'Asia/Jakarta' | 'Asia/Jayapura' | 'Asia/Jerusalem' | 'Asia/Kabul' | 'Asia/Kamchatka' | 'Asia/Karachi' | 'Asia/Kashgar' | 'Asia/Kathmandu' | 'Asia/Katmandu' | 'Asia/Khandyga' | 'Asia/Kolkata' | 'Asia/Krasnoyarsk' | 'Asia/Kuala_Lumpur' | 'Asia/Kuching' | 'Asia/Kuwait' | 'Asia/Macao' | 'Asia/Macau' | 'Asia/Magadan' | 'Asia/Makassar' | 'Asia/Manila' | 'Asia/Muscat' | 'Asia/Nicosia' | 'Asia/Novokuznetsk' | 'Asia/Novosibirsk' | 'Asia/Omsk' | 'Asia/Oral' | 'Asia/Phnom_Penh' | 'Asia/Pontianak' | 'Asia/Pyongyang' | 'Asia/Qatar' | 'Asia/Qostanay' | 'Asia/Qyzylorda' | 'Asia/Rangoon' | 'Asia/Riyadh' | 'Asia/Saigon' | 'Asia/Sakhalin' | 'Asia/Samarkand' | 'Asia/Seoul' | 'Asia/Shanghai' | 'Asia/Singapore' | 'Asia/Srednekolymsk' | 'Asia/Taipei' | 'Asia/Tashkent' | 'Asia/Tbilisi' | 'Asia/Tehran' | 'Asia/Tel_Aviv' | 'Asia/Thimbu' | 'Asia/Thimphu' | 'Asia/Tokyo' | 'Asia/Tomsk' | 'Asia/Ujung_Pandang' | 'Asia/Ulaanbaatar' | 'Asia/Ulan_Bator' | 'Asia/Urumqi' | 'Asia/Ust-Nera' | 'Asia/Vientiane' | 'Asia/Vladivostok' | 'Asia/Yakutsk' | 'Asia/Yangon' | 'Asia/Yekaterinburg' | 'Asia/Yerevan' | 'Atlantic/Azores' | 'Atlantic/Bermuda' | 'Atlantic/Canary' | 'Atlantic/Cape_Verde' | 'Atlantic/Faeroe' | 'Atlantic/Faroe' | 'Atlantic/Jan_Mayen' | 'Atlantic/Madeira' | 'Atlantic/Reykjavik' | 'Atlantic/South_Georgia' | 'Atlantic/St_Helena' | 'Atlantic/Stanley' | 'Australia/ACT' | 'Australia/Adelaide' | 'Australia/Brisbane' | 'Australia/Broken_Hill' | 'Australia/Canberra' | 'Australia/Currie' | 'Australia/Darwin' | 'Australia/Eucla' | 'Australia/Hobart' | 'Australia/LHI' | 'Australia/Lindeman' | 'Australia/Lord_Howe' | 'Australia/Melbourne' | 'Australia/NSW' | 'Australia/North' | 'Australia/Perth' | 'Australia/Queensland' | 'Australia/South' | 'Australia/Sydney' | 'Australia/Tasmania' | 'Australia/Victoria' | 'Australia/West' | 'Australia/Yancowinna' | 'Brazil/Acre' | 'Brazil/DeNoronha' | 'Brazil/East' | 'Brazil/West' | 'CET' | 'Canada/Atlantic' | 'Canada/Central' | 'Canada/Eastern' | 'Canada/Mountain' | 'Canada/Newfoundland' | 'Canada/Pacific' | 'Canada/Saskatchewan' | 'Canada/Yukon' | 'Chile/Continental' | 'Chile/EasterIsland' | 'Cuba' | 'EET' | 'EST' | 'Egypt' | 'Eire' | 'Etc/GMT' | 'Etc/GMT+0' | 'Etc/GMT+1' | 'Etc/GMT+10' | 'Etc/GMT+11' | 'Etc/GMT+12' | 'Etc/GMT+2' | 'Etc/GMT+3' | 'Etc/GMT+4' | 'Etc/GMT+5' | 'Etc/GMT+6' | 'Etc/GMT+7' | 'Etc/GMT+8' | 'Etc/GMT+9' | 'Etc/GMT-0' | 'Etc/GMT-1' | 'Etc/GMT-10' | 'Etc/GMT-11' | 'Etc/GMT-12' | 'Etc/GMT-13' | 'Etc/GMT-14' | 'Etc/GMT-2' | 'Etc/GMT-3' | 'Etc/GMT-4' | 'Etc/GMT-5' | 'Etc/GMT-6' | 'Etc/GMT-7' | 'Etc/GMT-8' | 'Etc/GMT-9' | 'Etc/GMT0' | 'Etc/Greenwich' | 'Etc/UCT' | 'Etc/UTC' | 'Etc/Universal' | 'Etc/Zulu' | 'Europe/Amsterdam' | 'Europe/Andorra' | 'Europe/Astrakhan' | 'Europe/Athens' | 'Europe/Belfast' | 'Europe/Belgrade' | 'Europe/Berlin' | 'Europe/Bratislava' | 'Europe/Brussels' | 'Europe/Bucharest' | 'Europe/Budapest' | 'Europe/Busingen' | 'Europe/Chisinau' | 'Europe/Copenhagen' | 'Europe/Dublin' | 'Europe/Gibraltar' | 'Europe/Guernsey' | 'Europe/Helsinki' | 'Europe/Isle_of_Man' | 'Europe/Istanbul' | 'Europe/Jersey' | 'Europe/Kaliningrad' | 'Europe/Kiev' | 'Europe/Kirov' | 'Europe/Kyiv' | 'Europe/Lisbon' | 'Europe/Ljubljana' | 'Europe/London' | 'Europe/Luxembourg' | 'Europe/Madrid' | 'Europe/Malta' | 'Europe/Mariehamn' | 'Europe/Minsk' | 'Europe/Monaco' | 'Europe/Moscow' | 'Europe/Nicosia' | 'Europe/Oslo' | 'Europe/Paris' | 'Europe/Podgorica' | 'Europe/Prague' | 'Europe/Riga' | 'Europe/Rome' | 'Europe/Samara' | 'Europe/San_Marino' | 'Europe/Sarajevo' | 'Europe/Saratov' | 'Europe/Simferopol' | 'Europe/Skopje' | 'Europe/Sofia' | 'Europe/Stockholm' | 'Europe/Tallinn' | 'Europe/Tirane' | 'Europe/Tiraspol' | 'Europe/Ulyanovsk' | 'Europe/Uzhgorod' | 'Europe/Vaduz' | 'Europe/Vatican' | 'Europe/Vienna' | 'Europe/Vilnius' | 'Europe/Volgograd' | 'Europe/Warsaw' | 'Europe/Zagreb' | 'Europe/Zaporozhye' | 'Europe/Zurich' | 'GB' | 'GB-Eire' | 'GMT' | 'Greenwich' | 'HST' | 'Hongkong' | 'Iceland' | 'Indian/Antananarivo' | 'Indian/Chagos' | 'Indian/Christmas' | 'Indian/Cocos' | 'Indian/Comoro' | 'Indian/Kerguelen' | 'Indian/Mahe' | 'Indian/Maldives' | 'Indian/Mauritius' | 'Indian/Mayotte' | 'Indian/Reunion' | 'Iran' | 'Israel' | 'Jamaica' | 'Japan' | 'Kwajalein' | 'Libya' | 'MET' | 'MST' | 'Mexico/BajaNorte' | 'Mexico/BajaSur' | 'Mexico/General' | 'NZ' | 'NZ-CHAT' | 'Navajo' | 'PRC' | 'Pacific/Apia' | 'Pacific/Auckland' | 'Pacific/Bougainville' | 'Pacific/Chatham' | 'Pacific/Chuuk' | 'Pacific/Easter' | 'Pacific/Efate' | 'Pacific/Enderbury' | 'Pacific/Fakaofo' | 'Pacific/Fiji' | 'Pacific/Funafuti' | 'Pacific/Galapagos' | 'Pacific/Gambier' | 'Pacific/Guadalcanal' | 'Pacific/Guam' | 'Pacific/Honolulu' | 'Pacific/Johnston' | 'Pacific/Kanton' | 'Pacific/Kiritimati' | 'Pacific/Kosrae' | 'Pacific/Kwajalein' | 'Pacific/Majuro' | 'Pacific/Marquesas' | 'Pacific/Midway' | 'Pacific/Nauru' | 'Pacific/Niue' | 'Pacific/Norfolk' | 'Pacific/Noumea' | 'Pacific/Pago_Pago' | 'Pacific/Palau' | 'Pacific/Pitcairn' | 'Pacific/Pohnpei' | 'Pacific/Ponape' | 'Pacific/Port_Moresby' | 'Pacific/Rarotonga' | 'Pacific/Saipan' | 'Pacific/Samoa' | 'Pacific/Tahiti' | 'Pacific/Tarawa' | 'Pacific/Tongatapu' | 'Pacific/Truk' | 'Pacific/Wake' | 'Pacific/Wallis' | 'Pacific/Yap' | 'Poland' | 'Portugal' | 'ROC' | 'ROK' | 'Singapore' | 'Turkey' | 'UCT' | 'US/Alaska' | 'US/Aleutian' | 'US/Arizona' | 'US/Central' | 'US/East-Indiana' | 'US/Eastern' | 'US/Hawaii' | 'US/Indiana-Starke' | 'US/Michigan' | 'US/Mountain' | 'US/Pacific' | 'US/Samoa' | 'UTC' | 'Universal' | 'W-SU' | 'WET' | 'Zulu';

/** Time unit option */
export type option_time_unit =
    | 'minute'                                                  // Minute
    | 'hour'                                                    // Hour
    | 'day'                                                     // Day
    | 'week'                                                    // Week
    ;

/** Highlight color foreground option */
export type option_highlight_color_foreground =
    | 'default'                                                 // Default
    | 'gray'                                                    // Gray
    | 'brown'                                                   // Brown
    | 'orange'                                                  // Orange
    | 'yellow'                                                  // Yellow
    | 'teal'                                                    // Teal / Green
    | 'blue'                                                    // Blue
    | 'purple'                                                  // Purple
    | 'pink'                                                    // Pink
    | 'red'                                                     // Red
    ;

/** Highlight color background option */
export type option_highlight_color_background =
    | 'default_background'                                      // Default background
    | 'gray_background'                                         // Gray background
    | 'brown_background'                                        // Brown background
    | 'orange_background'                                       // Orange background
    | 'yellow_background'                                       // Yellow background
    | 'teal_background'                                         // Teal / Green background
    | 'blue_background'                                         // Blue background
    | 'purple_background'                                       // Purple background
    | 'pink_background'                                         // Pink background
    | 'red_background'                                          // Red background
    ;

/** Highlight color option */
export type option_highlight_color = option_highlight_color_foreground | option_highlight_color_background;

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
export type option_image_alignment =
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
    | 'default'                                                 // Default
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

/** Permission role option */
export type option_permission_role =
    | 'editor'                                                  // Full access
    | 'read_and_write'                                          // Can edit
    | 'comment_only'                                            // Can comment
    | 'reader'                                                  // Can read
    ;

/** Record type collection */
export type collection_record_type =
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

/** Block type collection */
export type collection_block_type = block['type'];

/** Date type collection */
export type collection_date_type = date['type'];

/** Annotation tag collection */
export type collection_annotation_tag = annotation[0];

/** Template variable type collection */
export type collection_template_variable_type =
    | 'now'                                                     // Time when duplicated
    | 'today'                                                   // Date when duplicated
    | 'me'                                                      // User when duplicated
    ;

/** Reminder (0 minutes, 5 minutes, 10 minutes, 15 minutes, 30 minutes, 1 hour, 2 hours, 1 day, 2 days, 1 week before) */
export type reminder = {
    time: literal_time;                                         // Time of reminder which over days, always '09:00'
    unit: option_time_unit;                                     // Time unit
    value: number;                                              // Time value
    defaultTimeZone: option_time_zone;                          // Time zone of `time`
};

/** Date: date */
export type date_date = {
    type: 'date';
    reminder?: reminder;                                        // Reminder (1 day, 2 days, 1 week before)
    start_date: literal_date;                                   // Date
    date_format: option_date_format;                            // Date format
};

/** Date: datetime */
export type date_datetime = {
    type: 'datetime';
    reminder?: reminder;                                        // Reminder (0 minutes, 5 minutes, 10 minutes, 15 minutes, 30 minutes, 1 hour, 2 hours, 1 day, 2 days before)
    time_zone: option_time_zone;                                // Time zone
    start_date: literal_date;                                   // Date
    start_time: literal_time;                                   // Time
    date_format: option_date_format;                            // Date format
    time_format: option_time_format;                            // Time format
};

/** Date: date range */
export type date_daterange = {
    type: 'daterange';
    reminder?: reminder;                                        // Reminder (1 day, 2 days, 1 week before)
    start_date: literal_date;                                   // Start date
    end_date: literal_date;                                     // End date
    date_format: option_date_format;                            // Date format
};

/** Date: datetime range */
export type date_datetimerange = {
    type: 'datetimerange';
    reminder?: reminder;                                        // Reminder (0 minutes, 5 minutes, 10 minutes, 15 minutes, 30 minutes, 1 hour, 2 hours, 1 day, 2 days before)
    time_zone: option_time_zone;                                // Time zone
    start_date: literal_date;                                   // Start date
    start_time: literal_time;                                   // Start time
    end_date: literal_date;                                     // End date
    end_time: literal_time;                                     // End time
    date_format: option_date_format;                            // Date format
    time_format: option_time_format;                            // Time format
};

/** Date */
export type date = date_date | date_datetime | date_daterange | date_datetimerange;

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
    option_highlight_color,                                     // Color
];

/** Annotation: link */
export type annotation_link = [
    'a',
    literal_url,                                                // URL
];

/** Annotation: user mention (replace text with '‣') */
export type annotation_user = [
    'u',
    literal_uuid,                                               // Refer: notion_user
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
        type: collection_template_variable_type,                // Template variable type
    }
];

/** Annotation: page mention (replace text with '‣') */
export type annotation_page = [
    'p',
    literal_uuid,                                               // Refer: block (page is a block)
    literal_uuid?,                                              // Refer: space
];

/** Annotation: margin comment */
export type annotation_margin_comment = [
    'm',
    literal_uuid,                                               // Refer: discussion (comment is a child of discussion)
];

/** Annotation: suggested annotation */
export type annotation_suggested_annotation = [
    'sa',
    literal_uuid,                                               // Refer: discussion (suggestion is a child of discussion)
    annotation,                                                 // Annotation suggested to add
];

/** Annotation: suggested un-annotation */
export type annotation_suggested_unannotation = [
    'sua',
    literal_uuid,                                               // Refer: discussion (suggestion is a child of discussion)
    annotation,                                                 // Annotation suggested to remove
];

/** Annotation: suggested insertion */
export type annotation_suggested_insertion = [
    'si',
    literal_uuid,                                               // Refer: discussion (suggestion is a child of discussion)
];

/** Annotation: suggested removal */
export type annotation_suggested_removal = [
    'sr',
    literal_uuid,                                               // Refer: discussion (suggestion is a child of discussion)
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
    ;

/** Rich text */
export type rich_text = Array<[
    string,                                                     // Plain text
    Array<annotation>?,                                         // Annotations
]>;

/** Reference record pointer, pointer to a record with record type */
export type record_pointer = {
    id: literal_uuid;                                           // Refer: record
    table: collection_record_type;                              // Record type
    spaceId?: literal_uuid;                                     // Refer: space, the space where the record is located
};

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
}

/** Record map */
export type record_map = Partial<Record<collection_record_type, Record<literal_uuid, record>>>;

/** Record core */
export type record_core = {
    id: literal_uuid;                                           // UUID
    version: literal_version;                                   // Version
};

/** Record: block */
export type record_block = record_core & {
    format?: {                                                  // Format of block:
        copied_from_pointer?: record_pointer;                // Refer: block, the block that this block is duplicated from
    };
    created_time: literal_timestamp;                            // Created time
    last_edited_time: literal_timestamp;                        // Last edited time
    parent_id: literal_uuid;                                    // Refer: record, parent record
    parent_table: collection_record_type;                       // Parent record type, almost 'block' or 'collection', sometimes 'team' or 'space'
    alive: boolean;                                             // Alive or in trash
    copied_from?: literal_uuid;                                 // Refer: block, the same as `format.copied_from_pointer`
    created_by_table: collection_record_type;                   // Created by record type
    created_by_id: literal_uuid;                                // Refer: record, created by record
    last_edited_by_table: collection_record_type;               // Last edited by record type
    last_edited_by_id: literal_uuid;                            // Refer: record, last edited by record
    space_id: literal_uuid;                                     // Refer: space, the space where the block is located
    moved_to_trash_table?: collection_record_type;              // Moved to trash by record type
    moved_to_trash_id?: literal_uuid;                           // Refer: record, moved to trash by record
    moved_to_trash_time?: literal_timestamp;                    // Moved to trash time
}

/** Record */
export type record =
    | record_core                                               // Abstract record
    | record_block                                              // Block
    ;

/** Block: text */
export type block_text = record_block & {
    type: 'text';
    properties?: {                                              // Properties:
        title?: rich_text;                                      // Text content
    };
    content?: Array<literal_uuid>;                              // Refer: block, children blocks
    format?: {                                                  // Format of block:
        block_color?: option_highlight_color;                   // Block color
    };
};

/**
 * Block: heading 1
 *
 * case 1: normal heading
 *
 * case 2: toggleable heading
 */
export type block_header = record_block & {
    type: 'header';
    properties?: {                                              // Properties:
        title?: rich_text;                                      // Heading content
    };
    content?: Array<literal_uuid>;                              // Refer: block, children blocks // * case 2
    format: {                                                   // Format of block:
        toggleable?: boolean;                                   // Toggleable // * case 2
        block_color?: option_highlight_color;                   // Block color
    };
};

/**
 * Block: heading 2
 *
 * case 1: normal heading
 *
 * case 2: toggleable heading
 */
export type block_sub_header = record_block & {
    type: 'sub_header';
    properties?: {                                              // Properties:
        title?: rich_text;                                      // Heading content
    };
    content?: Array<literal_uuid>;                              // Refer: block, children blocks // * case 2
    format: {                                                   // Format of block:
        toggleable?: boolean;                                   // Toggleable // * case 2
        block_color?: option_highlight_color;                   // Block color
    };
};

/**
 * Block: heading 3
 *
 * case 1: normal heading
 *
 * case 2: toggleable heading
 */
export type block_sub_sub_header = record_block & {
    type: 'sub_sub_header';
    properties?: {                                              // Properties:
        title?: rich_text;                                      // Heading content
    };
    content?: Array<literal_uuid>;                              // Refer: block, children blocks // * case 2
    format: {                                                   // Format of block:
        toggleable?: boolean;                                   // Toggleable // * case 2
        block_color?: option_highlight_color;                   // Block color
    };
};

/** Block: to-do */
export type block_to_do = record_block & {
    type: 'to_do';
    properties?: {                                              // Properties:
        title?: rich_text;                                      // To-do description
        checked?: [[option_boolean]];                           // Checked or not
    };
    content?: Array<literal_uuid>;                              // Refer: block, children blocks
    format?: {                                                  // Format of block:
        block_color?: option_highlight_color;                   // Block color
    };
};

/** Block: bulleted list */
export type block_bulleted_list = record_block & {
    type: 'bulleted_list';
    properties?: {                                              // Properties:
        title?: rich_text;                                      // List item description
    };
    content?: Array<literal_uuid>;                              // Refer: block, children blocks
    format?: {                                                  // Format of block:
        bullet_list_format?: option_bullet_list_marker;         // Bullet list marker, default is 'disc', 'circle', 'square' cyclically
        block_color?: option_highlight_color;                   // Block color
    };
};

/** Block: numbered list */
export type block_numbered_list = record_block & {
    type: 'numbered_list';
    properties?: {                                              // Properties:
        title?: rich_text;                                      // List item description
    };
    content?: Array<literal_uuid>;                              // Refer: block, children blocks
    format?: {                                                  // Format of block:
        list_format?: option_numbered_list_marker;              // Numbered list type, default is 'numbers', 'letters', 'roman' cyclically
        block_color?: option_highlight_color;                   // Block color
    };
};

/** Block: toggle */
export type block_toggle = record_block & {
    type: 'toggle';
    properties?: {                                              // Properties:
        title?: rich_text;                                      // Toggle title
    };
    content?: Array<literal_uuid>;                              // Refer: block, children blocks
    format: {                                                   // Format of block:
        block_color?: option_highlight_color;                   // Block color
    };
};

/**
 * Block: code
 *
 * case 1: normal code
 *
 * case 2: mermaid code
 */
export type block_code = record_block & {
    type: 'code';
    properties: {                                               // Properties:
        title?: rich_text;                                      // Code content
        language: [[option_code_language]];                     // Code programming language
        caption?: rich_text;                                    // Caption of code
    };
    format?: {                                                  // Format of block:
        code_wrap: boolean;                                     // Code wrap or not
        code_preview_format?: option_code_preview_mode;         // Code preview mode // * case 2
    };
};

/** Block: quote */
export type block_quote = record_block & {
    type: 'quote';
    properties?: {                                              // Properties:
        title?: rich_text;                                      // Quote content
    };
    content?: Array<literal_uuid>;                              // Refer: block, children blocks
    format?: {                                                  // Format of block:
        quote_size?: option_quote_size;                         // Quote size
        block_color?: option_highlight_color;                   // Block color
    };
};

/**
 * Block: callout
 *
 * case 1: callout version 1, with a visible title
 *
 * case 2: callout version 2, no title, only icon
 */
export type block_callout = record_block & {
    type: 'callout';
    properties?: {                                              // Properties: // * case 1
        title?: rich_text;                                      // Callout title // * case 1
    };
    content?: Array<literal_uuid>;                              // Refer: block, children blocks
    format?: {                                                  // Format of block:
        page_icon?: literal_icon;                               // Callout icon
        block_color?: option_highlight_color;                   // Block color
        callout_version?: number;                               // Callout version, 2 means new callout // * case 2
    };
};

/** Block: equation */
export type block_equation = record_block & {
    type: 'equation';
    properties?: {                                              // Properties:
        title?: rich_text;                                      // Equation description
    };
    format?: {                                                  // Format of block:
        block_color?: option_highlight_color;                   // Block color
    };
};

/** Block: synced block (source) */
export type block_transclusion_container = record_block & {
    type: 'transclusion_container';
    content?: Array<literal_uuid>;                              // Refer: block, children blocks
};

/** Block: synced block (reference) */
export type block_transclusion_reference = record_block & {
    type: 'transclusion_reference';
    format: {                                                   // Format of block:
        transclusion_reference_pointer: record_pointer;      // Refer: block, the block to be referenced
    };
};

/** Block: columns (list) */
export type block_column_list = record_block & {
    type: 'column_list';
    content: Array<literal_uuid>;                               // Refer: block, children blocks (block_column)
};

/** Block: columns (column) */
export type block_column = record_block & {
    type: 'column';
    content?: Array<literal_uuid>;                               // Refer: block, children blocks
    format?: {                                                   // Format of block:
        column_ratio: number;                                    // Column ratio, default is 1
    };
};

/** Block: table */
export type block_table = record_block & {
    type: 'table';
    content: Array<literal_uuid>;                               // Refer: block, children blocks (table_row)
    format: {                                                   // Format of block:
        table_block_row_header?: boolean;                       // With row header or not
        table_block_column_order: Array<literal_property_id>;   // Column order
        table_block_column_format?: Record<literal_property_id, {
            color?: option_highlight_color;                     // Column color
            width?: number;                                     // Column width (px)
        }>;
        table_block_column_header?: boolean;                    // With column header or not
    };
};

/** Block: table (row) */
export type block_table_row = record_block & {
    type: 'table_row';
    properties: {                                               // Cell of columns:
        [key in literal_property_id]: rich_text;                // Cell content
    };
    format?: {                                                  // Format of block:
        block_color?: option_highlight_color;                   // Block color
    };
};

/** Block: divider */
export type block_divider = record_block & {
    type: 'divider';
};

/** Block: link to page (block) */
export type block_alias = record_block & {
    type: 'alias';
    format: {                                                   // Format of block:
        alias_pointer: record_pointer;                       // Refer: block, the block to be linked
    };
};

/**
 * Block: image
 *
 * case 1: uploaded image
 *
 * case 2: external image
 */
export type block_image = record_block & {
    type: 'image';
    properties?: {                                              // Properties:
        size?: [[literal_file_size]];                           // Image size // * case 1
        title?: [[string]];                                     // Image file name // * case 1
        source: [[literal_url]];                                // Image source URL
        caption?: rich_text;                                    // Image caption
        alt_text?: [[string]];                                  // Image alt text, for screen reader
    };
    format?: {                                                  // Format of block:
        block_width?: number;                                   // Visual image width (px)
        block_height?: number;                                  // Visual image height (px)
        display_source: literal_url;                            // Image source URL
        block_alignment?: option_image_alignment;               // Image alignment, default is 'center'
        image_hyperlink?: literal_url;                          // Image hyperlink
        original_source?: literal_url;                          // Original image source URL, if image is edited // * case 1
        block_full_width?: boolean;                             // Full width mode, width is always full and height is manually set
        block_page_width?: boolean;                             // Page width mode, width is always page width and height is automatically set
        block_aspect_ratio?: number;                            // Aspect ratio, height / width // * case 1
        image_edit_metadata?: image_edit_metadata;              // Image edit metadata (for local image cropping) // * case 1
        block_preserve_scale?: boolean;                         // Preserve image scale or not, always true // * case 1
    };
};

/** Block: page */
export type block_page = record_block & {
    type: 'page';
    properties?: {                                              // Properties:
        title?: rich_text;                                      // Page title
    };
    content?: Array<literal_uuid>;                              // Refer: block, page content blocks
    format?: {                                                  // Format of block:
        site_id?: literal_uuid;                                 // Refer: site, if published to web
        page_font?: option_page_font;                           // Page font, default is 'default'
        page_icon?: literal_icon;                               // Page icon
        page_cover?: literal_url;                               // Page cover
        block_color?: option_highlight_color;                   // Block color
        block_locked?: boolean;                                 // Page locked or not
        block_locked_by?: literal_uuid;                         // Refer: notion_user, the user who locked the page
        page_full_width?: boolean;                              // Full width mode, page width is automatically set to full width
        page_small_text?: boolean;                              // Small text mode, page text is smaller
        page_cover_position?: literal_normalization_value;      // Page cover position, 0 is bottom, 1 is top, default is 0.5
        page_section_visibility?: page_section_visibility;      // Visibilities of page sections
        social_media_image_preview_url?: literal_url;           // Social media image preview URL, auto-generated
        page_floating_table_of_contents?: {
            state: option_float_toc_state;                      // Float table of contents state
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
export type block_collection_view_page = record_block & {
    type: 'collection_view_page';
    properties?: {                                              // Properties: // * case 2
        title?: rich_text;                                      // Page title, same to the collection record title // * case 2
    };
    content?: Array<literal_uuid>;                              // Refer: block, wiki homepage content blocks // * case 2
    view_ids: Array<literal_uuid>;                              // Refer: collection_view, collection view IDs
    collection_id: literal_uuid;                                // Refer: collection, the original database
    format?: {                                                  // Format of block:
        app_id?: literal_uuid;                                  // Refer: app (TODO: what is this?) // * case 2
        site_id?: literal_uuid;                                 // Refer: site, if published to web
        app_uri_map?: {                                         // (TODO: what is this?) // * case 2
            'notion://wiki_collection': literal_uuid;           // Refer: collection, the same as `collection_id` // * case 2
        }
        block_color?: option_highlight_color;                   // Block color
        block_locked?: boolean;                                 // Page locked or not
        app_config_uri?: literal_url;                           // like "notion://wiki_block" (TODO: what is this?) // * case 2
        block_locked_by?: literal_uuid;                         // Refer: notion_user, the user who locked the page
        collection_pointer: record_pointer;                  // Refer: collection, the same as `collection_id`
        social_media_image_preview_url?: literal_url;           // Social media image preview URL, auto-generated
    };
};

/**
 * Block: database view / linked database view
 *
 * case 1: view of database
 *
 * case 2: view of linked database
 */
export type block_collection_view = record_block & {
    type: 'collection_view';
    properties?: {                                              // Properties: // * case 2
        title?: rich_text;                                      // Link view page title // * case 2
    };
    view_ids: Array<literal_uuid>;                              // Refer: collection_view, collection view IDs
    collection_id?: literal_uuid;                               // Refer: collection, only for original database
    format?: {                                                  // Format of block:
        page_icon?: literal_icon;                               // Link view page icon // * case 2
        page_cover?: literal_url;                               // Link view page cover // * case 2
        block_locked?: boolean;                                 // Page locked or not
        block_locked_by?: literal_uuid;                         // Refer: notion_user, the user who locked the page
        page_cover_position?: literal_normalization_value;      // Link view page cover position // * case 2
        collection_pointer: record_pointer;                  // Refer: collection, only for original database
    };
};

/** Block: bookmark */
export type block_bookmark = record_block & {
    type: 'bookmark';
    properties?: {                                              // Properties:
        link?: [[literal_url]];                                 // Web page URL
        title?: [[string]];                                     // Web page title
        caption?: rich_text;                                    // Bookmark caption
        description?: [[string]];                               // Web page description
    };
    format?: {                                                  // Format of block:
        block_color?: option_highlight_color;                   // Block color
        bookmark_icon?: literal_icon;                           // Web page icon
        bookmark_cover?: literal_url;                           // Web page cover
    };
};

/**
 * Block: file
 *
 * case 1: uploaded file
 *
 * case 2: external file
 */
export type block_file = record_block & {
    type: 'file';
    properties?: {                                              // Properties:
        size?: [[literal_file_size]];                           // File size // * case 1
        title?: [[string]];                                     // File name
        source: [[literal_url]];                                // File source URL
        caption?: rich_text;                                    // File caption
    };
    format?: {                                                  // Format of block:
        block_color?: option_highlight_color;                   // Block color
    };
};

/**
 * Block: embed
 *
 * case 1: uploaded embed
 *
 * case 2: external embed
 */
export type block_embed = record_block & {
    type: 'embed';
    properties?: {                                              // Properties:
        size?: [[literal_file_size]];                           // Embed file size // * case 1
        title?: [[string]];                                     // Embed file name // * case 1
        source: [[literal_url]];                                // Embed source URL
        caption?: rich_text;                                    // Embed caption
    };
    format?: {                                                  // Format of block:
        block_width?: number;                                   // Visual embed width (px)
        block_height?: number;                                  // Visual embed height (px)
        block_alignment?: option_image_alignment;               // Embed alignment, default is 'center'
        block_full_width?: boolean;                             // Full width mode, width is always full and height is manually set
        block_page_width?: boolean;                             // Page width mode, width is always page width and height is automatically set
        block_preserve_scale?: boolean;                         // Preserve embed scale or not
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

/*
export type notion_user = record_base & {
    email: string;                                              // email
    given_name: string;
    family_name: string;
    profile_photo: literal_url;                                 // icon url (amazon s3)
    onboarding_completed: boolean;
    mobile_onboarding_completed: boolean;
    clipper_onboarding_completed: boolean;
    name: string;                                               // `${given_name} ${family_name}`
};

export type bot = record_editable & {
    name: string;
    parent_table: 'space';
    parent_id: literal_uuid;                                    // refer: space
    alive: boolean;
    type: 'guest';
    icon: literal_url;                                          // icon url (amazon s3)
    space_id: literal_uuid;                                     // refer: space
    capabilities: {                                             // permissions
        read_comment: boolean;
        read_content: boolean;
        insert_comment: boolean;
        insert_content: boolean;
        update_content: boolean;
        read_user_with_email: boolean;
        read_user_without_email: boolean;
    };
};

export type user_root = record_base & {                         // *share uuid with notion_user
    space_views: Array<literal_uuid>;                           // refer: space_view
    left_spaces: Array<literal_uuid>;                           // refer: space
    space_view_pointers: Array<{
        id: literal_uuid;                                       // refer: space_view
        table: 'space_view';
        spaceId: literal_uuid;                                  // refer: space
    }>;
};

export type user_settings = record_base & {                     // *share uuid with notion_user
    settings: Record<string, unknown>;                          // TODO
};

export type space_view = record_base & {
    space_id: literal_uuid;                                     // refer: space
    bookmarked_pages?: Array<literal_uuid>;                     // refer: block
    parent_id: literal_uuid;                                    // refer: user_root
    parent_table: 'user_root';
    alive: boolean;
    notify_mobile: boolean;
    notify_desktop: boolean;
    notify_email: boolean;
    visited_template?: Array<literal_uuid>;                     // refer: block, https://www.notion.so/?tg=XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
    sidebar_hidden_templates?: Array<literal_uuid>;             // refer: block, https://www.notion.so/?tg=XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
    private_pages?: Array<literal_uuid>;                        // refer: block, root pages
    joined: boolean;
    joined_teams?: Array<literal_uuid>;                         // refer: team
    settings: Record<string, unknown>;                          // TODO
    sidebar_order?: Array<
        | 'favorites'
        | 'teamspaces'
        | 'shared'
        | 'private'
    >;
    first_joined_space_time: string;                            // timestamp (Why string?)
};

export type team = record_editable & {
    space_id: literal_uuid;                                     // refer: space
    name: string;
    description: string;
    icon: literal_icon;                                         // icon url (amazon s3)
    team_pages?: Array<literal_uuid>;                           // refer: block
    parent_id: literal_uuid;                                    // refer: space
    parent_table: 'space';
    settings: Record<string, unknown>;                          // TODO
    is_default: boolean;
    permissions: Array<{
        role: option_permission_role;
        type:
        | 'explicit_team_owner_permission'                      // teamspace owners permission, with team_id
        | 'explicit_team_permission'                            // teamspace members permission, with team_id
        | 'space_permission';                                   // everyone else in space
        team_id?: literal_uuid;                                 // refer: team, this team's uuid
    }>;
    membership: Array<{
        type:
        | 'owner'                                               // owner
        | 'member';                                             // member
        user_id?: literal_uuid;                                 // refer: notion_user
        group_id?: literal_uuid;                                // refer: notion_permission_group
        entity_type:
        | 'user'                                                // user, with user_id
        | 'group';                                              // group, with group_id
    }>;
};

export type space = record_editable & {
    name: string;
    permissions: Array<{
        role: option_permission_role;
        type:
        | 'user_permission';                                     // user permission, with user_id
        user_id: literal_uuid;                                  // refer: notion_user, member's uuid
    }>;
    permission_groups?: Array<{                                 // *plus space can add groups
        id: literal_uuid;                                       // refer: notion_permission_group
        icon: literal_icon;                                     // icon url (amazon s3)
        name: string;
        user_ids: Array<literal_uuid>;                          // refer: notion_user, member's uuid
        last_edited_time: number;                               // timestamp
    }>;
    icon: literal_icon;                                         // icon url (amazon s3)
    beta_enabled: boolean;
    disable_public_access?: boolean;                            // *for plus
    disable_guests?: boolean;                                   // *for plus
    disable_move_to_space?: boolean;                            // *for plus
    disable_export?: boolean;                                   // *for plus
    plan_type:
    | 'personal'
    | 'team';
    invite_link_enabled: boolean;
    disable_space_page_edits: boolean;
    disable_public_access_requests: boolean;
    disable_team_creation: boolean;
    bot_settings?: Record<string, unknown>;                     // TODO
    settings: Record<string, unknown>;                          // TODO
    subscription_tier:
    | 'free'
    | 'plus'
    | 'business'
    | 'enterprise';
    short_id: number;
    short_id_str: string;
};
*/
