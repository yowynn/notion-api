export type literal_uuid = string;                              // XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX

export type literal_property_id = string;                       // XXXX (4 random characters)

export type literal_date = string;                              // YYYY-MM-DD

export type literal_time = string;                              // HH:MM

export type literal_url = string;                               // full url, or relative url base on 'https://www.notion.so'

export type literal_emoji = string;                             // emoji

export type literal_icon = literal_emoji | literal_url;

export type literal_date_format =
    | 'relative'                                                // Relative
    | 'MM/DD/YYYY'                                              // Month/Day/Year
    | 'DD/MM/YYYY'                                              // Day/Month/Year
    | 'YYYY/MM/DD'                                              // Year/Month/Day
    | 'll';                                                     // Full Date

export type literal_time_format =
    | 'LT'                                                      // 12 hour
    | 'H:mm'                                                    // 24 hour
    | ' ';                                                      // Hidden

export type literal_highlight_color_foreground =
    | 'gray'
    | 'brown'
    | 'orange'
    | 'yellow'
    | 'green'
    | 'blue'
    | 'purple'
    | 'pink'
    | 'red';

export type literal_highlight_color_background =
    | 'gray_background'
    | 'brown_background'
    | 'orange_background'
    | 'yellow_background'
    | 'green_background'
    | 'blue_background'
    | 'purple_background'
    | 'pink_background'
    | 'red_background';

export type literal_highlight_color = 'default' | literal_highlight_color_foreground | literal_highlight_color_background;

export type literal_time_zone = 'Africa/Abidjan' | 'Africa/Accra' | 'Africa/Addis_Ababa' | 'Africa/Algiers' | 'Africa/Asmara' | 'Africa/Asmera' | 'Africa/Bamako' | 'Africa/Bangui' | 'Africa/Banjul' | 'Africa/Bissau' | 'Africa/Blantyre' | 'Africa/Brazzaville' | 'Africa/Bujumbura' | 'Africa/Cairo' | 'Africa/Casablanca' | 'Africa/Ceuta' | 'Africa/Conakry' | 'Africa/Dakar' | 'Africa/Dar_es_Salaam' | 'Africa/Djibouti' | 'Africa/Douala' | 'Africa/El_Aaiun' | 'Africa/Freetown' | 'Africa/Gaborone' | 'Africa/Harare' | 'Africa/Johannesburg' | 'Africa/Juba' | 'Africa/Kampala' | 'Africa/Khartoum' | 'Africa/Kigali' | 'Africa/Kinshasa' | 'Africa/Lagos' | 'Africa/Libreville' | 'Africa/Lome' | 'Africa/Luanda' | 'Africa/Lubumbashi' | 'Africa/Lusaka' | 'Africa/Malabo' | 'Africa/Maputo' | 'Africa/Maseru' | 'Africa/Mbabane' | 'Africa/Mogadishu' | 'Africa/Monrovia' | 'Africa/Nairobi' | 'Africa/Ndjamena' | 'Africa/Niamey' | 'Africa/Nouakchott' | 'Africa/Ouagadougou' | 'Africa/Porto-Novo' | 'Africa/Sao_Tome' | 'Africa/Timbuktu' | 'Africa/Tripoli' | 'Africa/Tunis' | 'Africa/Windhoek' | 'America/Adak' | 'America/Anchorage' | 'America/Anguilla' | 'America/Antigua' | 'America/Araguaina' | 'America/Argentina/Buenos_Aires' | 'America/Argentina/Catamarca' | 'America/Argentina/ComodRivadavia' | 'America/Argentina/Cordoba' | 'America/Argentina/Jujuy' | 'America/Argentina/La_Rioja' | 'America/Argentina/Mendoza' | 'America/Argentina/Rio_Gallegos' | 'America/Argentina/Salta' | 'America/Argentina/San_Juan' | 'America/Argentina/San_Luis' | 'America/Argentina/Tucuman' | 'America/Argentina/Ushuaia' | 'America/Aruba' | 'America/Asuncion' | 'America/Atikokan' | 'America/Atka' | 'America/Bahia' | 'America/Bahia_Banderas' | 'America/Barbados' | 'America/Belem' | 'America/Belize' | 'America/Blanc-Sablon' | 'America/Boa_Vista' | 'America/Bogota' | 'America/Boise' | 'America/Buenos_Aires' | 'America/Cambridge_Bay' | 'America/Campo_Grande' | 'America/Cancun' | 'America/Caracas' | 'America/Catamarca' | 'America/Cayenne' | 'America/Cayman' | 'America/Chicago' | 'America/Chihuahua' | 'America/Ciudad_Juarez' | 'America/Coral_Harbour' | 'America/Cordoba' | 'America/Costa_Rica' | 'America/Creston' | 'America/Cuiaba' | 'America/Curacao' | 'America/Danmarkshavn' | 'America/Dawson' | 'America/Dawson_Creek' | 'America/Denver' | 'America/Detroit' | 'America/Dominica' | 'America/Edmonton' | 'America/Eirunepe' | 'America/El_Salvador' | 'America/Ensenada' | 'America/Fort_Nelson' | 'America/Fort_Wayne' | 'America/Fortaleza' | 'America/Glace_Bay' | 'America/Godthab' | 'America/Goose_Bay' | 'America/Grand_Turk' | 'America/Grenada' | 'America/Guadeloupe' | 'America/Guatemala' | 'America/Guayaquil' | 'America/Guyana' | 'America/Halifax' | 'America/Havana' | 'America/Hermosillo' | 'America/Indiana/Indianapolis' | 'America/Indiana/Knox' | 'America/Indiana/Marengo' | 'America/Indiana/Petersburg' | 'America/Indiana/Tell_City' | 'America/Indiana/Vevay' | 'America/Indiana/Vincennes' | 'America/Indiana/Winamac' | 'America/Indianapolis' | 'America/Inuvik' | 'America/Iqaluit' | 'America/Jamaica' | 'America/Jujuy' | 'America/Juneau' | 'America/Kentucky/Louisville' | 'America/Kentucky/Monticello' | 'America/Knox_IN' | 'America/Kralendijk' | 'America/La_Paz' | 'America/Lima' | 'America/Los_Angeles' | 'America/Louisville' | 'America/Lower_Princes' | 'America/Maceio' | 'America/Managua' | 'America/Manaus' | 'America/Marigot' | 'America/Martinique' | 'America/Matamoros' | 'America/Mazatlan' | 'America/Mendoza' | 'America/Menominee' | 'America/Merida' | 'America/Metlakatla' | 'America/Mexico_City' | 'America/Miquelon' | 'America/Moncton' | 'America/Monterrey' | 'America/Montevideo' | 'America/Montreal' | 'America/Montserrat' | 'America/Nassau' | 'America/New_York' | 'America/Nipigon' | 'America/Nome' | 'America/Noronha' | 'America/North_Dakota/Beulah' | 'America/North_Dakota/Center' | 'America/North_Dakota/New_Salem' | 'America/Nuuk' | 'America/Ojinaga' | 'America/Panama' | 'America/Pangnirtung' | 'America/Paramaribo' | 'America/Phoenix' | 'America/Port-au-Prince' | 'America/Port_of_Spain' | 'America/Porto_Acre' | 'America/Porto_Velho' | 'America/Puerto_Rico' | 'America/Punta_Arenas' | 'America/Rainy_River' | 'America/Rankin_Inlet' | 'America/Recife' | 'America/Regina' | 'America/Resolute' | 'America/Rio_Branco' | 'America/Rosario' | 'America/Santa_Isabel' | 'America/Santarem' | 'America/Santiago' | 'America/Santo_Domingo' | 'America/Sao_Paulo' | 'America/Scoresbysund' | 'America/Shiprock' | 'America/Sitka' | 'America/St_Barthelemy' | 'America/St_Johns' | 'America/St_Kitts' | 'America/St_Lucia' | 'America/St_Thomas' | 'America/St_Vincent' | 'America/Swift_Current' | 'America/Tegucigalpa' | 'America/Thule' | 'America/Thunder_Bay' | 'America/Tijuana' | 'America/Toronto' | 'America/Tortola' | 'America/Vancouver' | 'America/Virgin' | 'America/Whitehorse' | 'America/Winnipeg' | 'America/Yakutat' | 'America/Yellowknife' | 'Antarctica/Casey' | 'Antarctica/Davis' | 'Antarctica/DumontDUrville' | 'Antarctica/Macquarie' | 'Antarctica/Mawson' | 'Antarctica/McMurdo' | 'Antarctica/Palmer' | 'Antarctica/Rothera' | 'Antarctica/South_Pole' | 'Antarctica/Syowa' | 'Antarctica/Troll' | 'Antarctica/Vostok' | 'Arctic/Longyearbyen' | 'Asia/Aden' | 'Asia/Almaty' | 'Asia/Amman' | 'Asia/Anadyr' | 'Asia/Aqtau' | 'Asia/Aqtobe' | 'Asia/Ashgabat' | 'Asia/Ashkhabad' | 'Asia/Atyrau' | 'Asia/Baghdad' | 'Asia/Bahrain' | 'Asia/Baku' | 'Asia/Bangkok' | 'Asia/Barnaul' | 'Asia/Beirut' | 'Asia/Bishkek' | 'Asia/Brunei' | 'Asia/Calcutta' | 'Asia/Chita' | 'Asia/Choibalsan' | 'Asia/Chongqing' | 'Asia/Chungking' | 'Asia/Colombo' | 'Asia/Dacca' | 'Asia/Damascus' | 'Asia/Dhaka' | 'Asia/Dili' | 'Asia/Dubai' | 'Asia/Dushanbe' | 'Asia/Famagusta' | 'Asia/Gaza' | 'Asia/Harbin' | 'Asia/Hebron' | 'Asia/Ho_Chi_Minh' | 'Asia/Hong_Kong' | 'Asia/Hovd' | 'Asia/Irkutsk' | 'Asia/Istanbul' | 'Asia/Jakarta' | 'Asia/Jayapura' | 'Asia/Jerusalem' | 'Asia/Kabul' | 'Asia/Kamchatka' | 'Asia/Karachi' | 'Asia/Kashgar' | 'Asia/Kathmandu' | 'Asia/Katmandu' | 'Asia/Khandyga' | 'Asia/Kolkata' | 'Asia/Krasnoyarsk' | 'Asia/Kuala_Lumpur' | 'Asia/Kuching' | 'Asia/Kuwait' | 'Asia/Macao' | 'Asia/Macau' | 'Asia/Magadan' | 'Asia/Makassar' | 'Asia/Manila' | 'Asia/Muscat' | 'Asia/Nicosia' | 'Asia/Novokuznetsk' | 'Asia/Novosibirsk' | 'Asia/Omsk' | 'Asia/Oral' | 'Asia/Phnom_Penh' | 'Asia/Pontianak' | 'Asia/Pyongyang' | 'Asia/Qatar' | 'Asia/Qostanay' | 'Asia/Qyzylorda' | 'Asia/Rangoon' | 'Asia/Riyadh' | 'Asia/Saigon' | 'Asia/Sakhalin' | 'Asia/Samarkand' | 'Asia/Seoul' | 'Asia/Shanghai' | 'Asia/Singapore' | 'Asia/Srednekolymsk' | 'Asia/Taipei' | 'Asia/Tashkent' | 'Asia/Tbilisi' | 'Asia/Tehran' | 'Asia/Tel_Aviv' | 'Asia/Thimbu' | 'Asia/Thimphu' | 'Asia/Tokyo' | 'Asia/Tomsk' | 'Asia/Ujung_Pandang' | 'Asia/Ulaanbaatar' | 'Asia/Ulan_Bator' | 'Asia/Urumqi' | 'Asia/Ust-Nera' | 'Asia/Vientiane' | 'Asia/Vladivostok' | 'Asia/Yakutsk' | 'Asia/Yangon' | 'Asia/Yekaterinburg' | 'Asia/Yerevan' | 'Atlantic/Azores' | 'Atlantic/Bermuda' | 'Atlantic/Canary' | 'Atlantic/Cape_Verde' | 'Atlantic/Faeroe' | 'Atlantic/Faroe' | 'Atlantic/Jan_Mayen' | 'Atlantic/Madeira' | 'Atlantic/Reykjavik' | 'Atlantic/South_Georgia' | 'Atlantic/St_Helena' | 'Atlantic/Stanley' | 'Australia/ACT' | 'Australia/Adelaide' | 'Australia/Brisbane' | 'Australia/Broken_Hill' | 'Australia/Canberra' | 'Australia/Currie' | 'Australia/Darwin' | 'Australia/Eucla' | 'Australia/Hobart' | 'Australia/LHI' | 'Australia/Lindeman' | 'Australia/Lord_Howe' | 'Australia/Melbourne' | 'Australia/NSW' | 'Australia/North' | 'Australia/Perth' | 'Australia/Queensland' | 'Australia/South' | 'Australia/Sydney' | 'Australia/Tasmania' | 'Australia/Victoria' | 'Australia/West' | 'Australia/Yancowinna' | 'Brazil/Acre' | 'Brazil/DeNoronha' | 'Brazil/East' | 'Brazil/West' | 'CET' | 'CST6CDT' | 'Canada/Atlantic' | 'Canada/Central' | 'Canada/Eastern' | 'Canada/Mountain' | 'Canada/Newfoundland' | 'Canada/Pacific' | 'Canada/Saskatchewan' | 'Canada/Yukon' | 'Chile/Continental' | 'Chile/EasterIsland' | 'Cuba' | 'EET' | 'EST' | 'EST5EDT' | 'Egypt' | 'Eire' | 'Etc/GMT' | 'Etc/GMT+0' | 'Etc/GMT+1' | 'Etc/GMT+10' | 'Etc/GMT+11' | 'Etc/GMT+12' | 'Etc/GMT+2' | 'Etc/GMT+3' | 'Etc/GMT+4' | 'Etc/GMT+5' | 'Etc/GMT+6' | 'Etc/GMT+7' | 'Etc/GMT+8' | 'Etc/GMT+9' | 'Etc/GMT-0' | 'Etc/GMT-1' | 'Etc/GMT-10' | 'Etc/GMT-11' | 'Etc/GMT-12' | 'Etc/GMT-13' | 'Etc/GMT-14' | 'Etc/GMT-2' | 'Etc/GMT-3' | 'Etc/GMT-4' | 'Etc/GMT-5' | 'Etc/GMT-6' | 'Etc/GMT-7' | 'Etc/GMT-8' | 'Etc/GMT-9' | 'Etc/GMT0' | 'Etc/Greenwich' | 'Etc/UCT' | 'Etc/UTC' | 'Etc/Universal' | 'Etc/Zulu' | 'Europe/Amsterdam' | 'Europe/Andorra' | 'Europe/Astrakhan' | 'Europe/Athens' | 'Europe/Belfast' | 'Europe/Belgrade' | 'Europe/Berlin' | 'Europe/Bratislava' | 'Europe/Brussels' | 'Europe/Bucharest' | 'Europe/Budapest' | 'Europe/Busingen' | 'Europe/Chisinau' | 'Europe/Copenhagen' | 'Europe/Dublin' | 'Europe/Gibraltar' | 'Europe/Guernsey' | 'Europe/Helsinki' | 'Europe/Isle_of_Man' | 'Europe/Istanbul' | 'Europe/Jersey' | 'Europe/Kaliningrad' | 'Europe/Kiev' | 'Europe/Kirov' | 'Europe/Kyiv' | 'Europe/Lisbon' | 'Europe/Ljubljana' | 'Europe/London' | 'Europe/Luxembourg' | 'Europe/Madrid' | 'Europe/Malta' | 'Europe/Mariehamn' | 'Europe/Minsk' | 'Europe/Monaco' | 'Europe/Moscow' | 'Europe/Nicosia' | 'Europe/Oslo' | 'Europe/Paris' | 'Europe/Podgorica' | 'Europe/Prague' | 'Europe/Riga' | 'Europe/Rome' | 'Europe/Samara' | 'Europe/San_Marino' | 'Europe/Sarajevo' | 'Europe/Saratov' | 'Europe/Simferopol' | 'Europe/Skopje' | 'Europe/Sofia' | 'Europe/Stockholm' | 'Europe/Tallinn' | 'Europe/Tirane' | 'Europe/Tiraspol' | 'Europe/Ulyanovsk' | 'Europe/Uzhgorod' | 'Europe/Vaduz' | 'Europe/Vatican' | 'Europe/Vienna' | 'Europe/Vilnius' | 'Europe/Volgograd' | 'Europe/Warsaw' | 'Europe/Zagreb' | 'Europe/Zaporozhye' | 'Europe/Zurich' | 'GB' | 'GB-Eire' | 'GMT' | 'GMT+0' | 'GMT-0' | 'GMT0' | 'Greenwich' | 'HST' | 'Hongkong' | 'Iceland' | 'Indian/Antananarivo' | 'Indian/Chagos' | 'Indian/Christmas' | 'Indian/Cocos' | 'Indian/Comoro' | 'Indian/Kerguelen' | 'Indian/Mahe' | 'Indian/Maldives' | 'Indian/Mauritius' | 'Indian/Mayotte' | 'Indian/Reunion' | 'Iran' | 'Israel' | 'Jamaica' | 'Japan' | 'Kwajalein' | 'Libya' | 'MET' | 'MST' | 'MST7MDT' | 'Mexico/BajaNorte' | 'Mexico/BajaSur' | 'Mexico/General' | 'NZ' | 'NZ-CHAT' | 'Navajo' | 'PRC' | 'PST8PDT' | 'Pacific/Apia' | 'Pacific/Auckland' | 'Pacific/Bougainville' | 'Pacific/Chatham' | 'Pacific/Chuuk' | 'Pacific/Easter' | 'Pacific/Efate' | 'Pacific/Enderbury' | 'Pacific/Fakaofo' | 'Pacific/Fiji' | 'Pacific/Funafuti' | 'Pacific/Galapagos' | 'Pacific/Gambier' | 'Pacific/Guadalcanal' | 'Pacific/Guam' | 'Pacific/Honolulu' | 'Pacific/Johnston' | 'Pacific/Kanton' | 'Pacific/Kiritimati' | 'Pacific/Kosrae' | 'Pacific/Kwajalein' | 'Pacific/Majuro' | 'Pacific/Marquesas' | 'Pacific/Midway' | 'Pacific/Nauru' | 'Pacific/Niue' | 'Pacific/Norfolk' | 'Pacific/Noumea' | 'Pacific/Pago_Pago' | 'Pacific/Palau' | 'Pacific/Pitcairn' | 'Pacific/Pohnpei' | 'Pacific/Ponape' | 'Pacific/Port_Moresby' | 'Pacific/Rarotonga' | 'Pacific/Saipan' | 'Pacific/Samoa' | 'Pacific/Tahiti' | 'Pacific/Tarawa' | 'Pacific/Tongatapu' | 'Pacific/Truk' | 'Pacific/Wake' | 'Pacific/Wallis' | 'Pacific/Yap' | 'Poland' | 'Portugal' | 'ROC' | 'ROK' | 'Singapore' | 'Turkey' | 'UCT' | 'US/Alaska' | 'US/Aleutian' | 'US/Arizona' | 'US/Central' | 'US/East-Indiana' | 'US/Eastern' | 'US/Hawaii' | 'US/Indiana-Starke' | 'US/Michigan' | 'US/Mountain' | 'US/Pacific' | 'US/Pacific-New' | 'US/Samoa' | 'UTC' | 'Universal' | 'W-SU' | 'WET' | 'Zulu';

export type literal_code_language = 'ABAP' | 'Agda' | 'Arduino' | 'Assembly' | 'Bash' | 'BASIC' | 'BNF' | 'C' | 'C#' | 'C++' | 'Clojure' | 'CoffeeScript' | 'Coq' | 'CSS' | 'Dart' | 'Dhall' | 'Diff' | 'Docker' | 'EBNF' | 'Elixir' | 'Elm' | 'Erlang' | 'F#' | 'Flow' | 'Fortran' | 'Gherkin' | 'GLSL' | 'Go' | 'GraphQL' | 'Groovy' | 'Haskell' | 'HTML' | 'Idris' | 'Java' | 'JavaScript' | 'JSON' | 'Julia' | 'Kotlin' | 'LaTeX' | 'Less' | 'Lisp' | 'LiveScript' | 'LLVM IR' | 'Lua' | 'Makefile' | 'Markdown' | 'Markup' | 'MATLAB' | 'Mathematica' | 'Mermaid' | 'Nix' | 'Notion Formula' | 'Objective-C' | 'OCaml' | 'Pascal' | 'Perl' | 'PHP' | 'Plain Text' | 'PowerShell' | 'Prolog' | 'Protobuf' | 'PureScript' | 'Python' | 'R' | 'Racket' | 'Reason' | 'Ruby' | 'Rust' | 'Sass' | 'Scala' | 'Scheme' | 'Scss' | 'Shell' | 'Solidity' | 'SQL' | 'Swift' | 'TOML' | 'TypeScript' | 'VB.Net' | 'Verilog' | 'VHDL' | 'Visual Basic' | 'WebAssembly' | 'XML' | 'YAML';

export type literal_permission_role =
    | 'editor'                                                  // full access
    | 'read_and_write'                                          // can edit
    | 'comment_only'                                            // can comment
    | 'reader';                                                 // can read

export type date_reminder = {
    time: literal_time;                                         // always '09:00'
    unit:
    | 'day'                                                     // with value: 0 (on the day), 1 (1 day before), 2 (2 days before)
    | 'week';                                                   // with value: 1 (1 week before)
    value: number;
    defaultTimeZone: literal_time_zone;
};

export type datetime_reminder = {
    unit:
    | 'minute'                                                  // with value: 0, 5, 10, 15, 30
    | 'hour';                                                   // with value: 1, 2
    value: number;
} | date_reminder;                                              // day with value: 1 (1 day before), 2 (2 days before)

export type date_point = {
    type: 'date';
    reminder?: date_reminder;
    start_date: literal_date;
    date_format: literal_date_format;
};

export type datetime_point = {
    type: 'datetime';
    reminder?: datetime_reminder;
    time_zone: literal_time_zone;
    start_date: literal_date;
    start_time: literal_time;
    date_format: literal_date_format;
    time_format: literal_time_format;
};

export type date_range = {
    type: 'daterange';
    reminder?: date_reminder;
    start_date: literal_date;
    end_date: literal_date;
    date_format: literal_date_format;
};

export type datetime_range = {
    type: 'datetimerange';
    reminder?: datetime_reminder;
    time_zone: literal_time_zone;
    start_date: literal_date;
    start_time: literal_time;
    end_date: literal_date;
    end_time: literal_time;
    date_format: literal_date_format;
    time_format: literal_time_format;
};

export type date = date_point | datetime_point | date_range | datetime_range;

// bold
export type annotation_bold = [
    'b',
];

// italic
export type annotation_italic = [
    'i',
];

// underline
export type annotation_underline = [
    '_',
];

// strikethrough
export type annotation_strikethrough = [
    's',
];

// code
export type annotation_code = [
    'c',
];

// equation (replace text with '⁍')
export type annotation_equation = [
    'e',
    string,                                                     // expression
];

// highlight
export type annotation_highlight = [
    'h',
    literal_highlight_color,                                    // color
];

// link
export type annotation_link = [
    'a',
    literal_url,                                                // url
];

// mention user (replace text with '‣')
export type annotation_user = [
    'u',
    literal_uuid,                                               // refer: notion_user
];

// mention date (replace text with '‣')
export type annotation_date = [
    'd',
    date,                                                       // refer: date
];

// mention template value (replace text with '‣')
export type annotation_template = [
    'tv',
    {
        type:
        | 'now'                                                 // Time when duplicated
        | 'today'                                               // Date when duplicated
        | 'me';                                                 // User when duplicated
    }
];

// mention page (replace text with '‣')
export type annotation_page = [
    'p',
    literal_uuid,                                               // refer: block
    literal_uuid,                                               // refer: space
];

// comment
export type annotation_comment = [
    'm',
    literal_uuid,                                               // refer: discussion
];

// suggested annotation
export type annotation_suggest_annotation = [
    'sa',
    literal_uuid,                                               // refer: discussion
    annotation,
];

// suggested un-annotation
export type annotation_suggest_unannotation = [
    'sua',
    literal_uuid,                                               // refer: discussion
    annotation,
];

// suggested insertion
export type annotation_suggest_insertion = [
    'si',
    literal_uuid,                                               // refer: discussion
];

// suggested removal
export type annotation_suggest_removal = [
    'sr',
    literal_uuid,                                               // refer: discussion
];

export type annotation =
    | annotation_bold
    | annotation_italic
    | annotation_underline
    | annotation_strikethrough
    | annotation_code
    | annotation_equation
    | annotation_highlight
    | annotation_link
    | annotation_user
    | annotation_date
    | annotation_template
    | annotation_page
    | annotation_comment
    | annotation_suggest_annotation
    | annotation_suggest_unannotation
    | annotation_suggest_insertion
    | annotation_suggest_removal;

export type rich_text_item = [
    string,                                                     // text
    Array<annotation>?,                                         // annotations
];

export type rich_text = Array<rich_text_item>;

export type record_base = {
    id: literal_uuid;
    version: number;                                            // after modification, version++
};

export type record_editable = record_base & {
    created_time: number;                                       // timestamp
    last_edited_time: number;                                   // timestamp
    created_by_table:
    | 'notion_user'
    | 'bot';
    created_by_id: literal_uuid;
    last_edited_by_table:
    | 'notion_user'
    | 'bot';
    last_edited_by_id: literal_uuid;
};

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
        role: literal_permission_role;
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
        role: literal_permission_role;
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

export type block_base = record_editable & {
    properties?: {
        title: rich_text;
    };
    content?: Array<literal_uuid>;                              // refer: block
    format?: {
        block_color?: literal_highlight_color;
        copied_from_pointer?: {                                 // *if the block is duplicated from template
            id: literal_uuid;                                   // refer: block
            table: 'block';
            spaceId: literal_uuid;                              // refer: space
        };
        social_media_image_preview_url?: literal_url;           // the url of the image to use for social media previews
    };
    parent_id: literal_uuid;                                    // refer: parent_table
    parent_table: 'block';
    alive: boolean;
    copied_from?: literal_uuid;                                 // refer: block // *if the block is duplicated from template
    space_id: literal_uuid;                                     // refer: space
};

// block: Text
export type block_text = block_base & {
    type: 'text';
};

// block: Heading 1 (Toggle)
export type block_header = block_base & ({
    type: 'header';
    content: never;
} | {
    type: 'header';
    format: {
        toggleable: true;
    };
});

// block: Heading 2 (Toggle)
export type block_sub_header = block_base & ({
    type: 'sub_header';
    content: never;
} | {
    type: 'sub_header';
    format: {
        toggleable: true;
    };
});

// block: Heading 3 (Toggle)
export type block_sub_sub_header = block_base & ({
    type: 'sub_sub_header';
    content: never;
} | {
    type: 'sub_sub_header';
    format: {
        toggleable: true;
    };
});

// block: To-do
export type block_to_do = block_base & {
    type: 'to_do';
    properties?: {
        checked?: [
            | 'Yes'
            | 'No',
        ];
    };
};

// block: Bulleted list
export type block_bulleted_list = block_base & {
    type: 'bulleted_list';
    format?: {
        bullet_list_format?:
        | 'disc'                                                // •
        | 'circle'                                              // ◦
        | 'square';                                             // ▪
    };
};

// block: Numbered list
export type block_numbered_list = block_base & {
    type: 'numbered_list';
    format?: {
        list_format?:
        | 'numbers'                                             // 1.
        | 'letters'                                             // a.
        | 'roman';                                              // i.
    };
};

// block: Toggle list
export type block_toggle = block_base & {
    type: 'toggle';
};

// block: Code
export type block_code = block_base & {
    type: 'code';
    properties?: {
        caption?: rich_text;
        language: [[literal_code_language]];
    };
    content: never;
    format?: {
        code_wrap: boolean;
        code_preview_format?:                                   // option for mermaid code
        | 'code'
        | 'preview'
        | 'split_view';
    };
};

// block: Quote
export type block_quote = block_base & {
    type: 'quote';
    format?: {
        quote_size?: 'large';                                   // the visual size of the quote will be larger
    };
};

// block: Callout
export type block_callout = block_base & {
    type: 'callout';
    format: {
        page_icon: literal_icon;                                // icon url (amazon s3)
    };
};

// block: Block equation
export type block_equation = block_base & {
    type: 'equation';
    content: never;
};

// block: Synced block
export type block_transclusion_container = block_base & {
    type: 'transclusion_container';
    properties: never;
};
export type block_transclusion_reference = block_base & {
    type: 'transclusion_reference';
    properties: never;
    content: never;
    format: {
        transclusion_reference_pointer: {
            id: literal_uuid;                                   // refer: block
            table: 'block';
            spaceId: literal_uuid;                              // refer: space
        };
    };
};

// block: Columns
export type block_column_list = block_base & {
    type: 'column_list';
    properties: never;
    content: Array<literal_uuid>;                               // refer: block (block_column)
};
export type block_column = block_base & {
    type: 'column';
    properties: never;
    content: Array<literal_uuid>;                               // refer: block
}

// block: Table
export type block_table = block_base & {
    type: 'table';
    properties: never;
    content: Array<literal_uuid>;                               // refer: block (table_row)
    format: {
        table_block_row_header?: boolean;
        table_block_column_header?: boolean;
        table_block_column_order: Array<literal_property_id>;
        table_block_column_format: Record<literal_property_id, {
            width: number;                                      // column width (px)
            color?: literal_highlight_color;                    // column color
        }>;
    };
};
export type block_table_row = block_base & {
    type: 'table_row';
    properties: Record<literal_property_id, rich_text>;
    content: never;
};

// block: Divider
export type block_divider = block_base & {
    type: 'divider';
    properties: never;
    content: never;
};

// block: Link to page
export type block_alias = block_base & {
    type: 'alias';
    properties: never;
    content: never;
    format: {
        alias_pointer: {
            id: literal_uuid;                                   // refer: block
            table: 'block';
            spaceId: literal_uuid;                              // refer: space
        };
    };
};

// block: Image
export type block_image = block_base & {
    type: 'image';
    properties?: {
        size?: [[string]];                                      // upload only, "104.4KB"
        title?: rich_text;                                      // upload only, image name
        source: [[literal_url]];                                // image url (amazon s3)
        caption?: rich_text;                                    // image caption
        alt_text?: [[string]];                                  // image alt text
    };
    format: {
        block_width?: number;                                   // block visual width (px)
        block_height?: number;                                  // block visual height (px)
        display_source: literal_url;                            // image url (amazon s3), same as properties.source
        block_alignment:
        | 'left'
        | 'center'
        | 'right';
        original_source?: literal_url;                          // upload and crop only, image url (amazon s3), original image
        block_full_width: boolean;                              // block full width
        block_page_width: boolean;                              // block page width
        block_aspect_ratio: number;                             // height / width
        image_edit_metadata?: {                                 // upload only, image edit metadata
            crop: {
                x: number;
                y: number;
                unit: '%';
                width: number;
                height: number;
            };
            mask:
            | 'Circle'                                          // circle mask
            | 'None';                                           // no mask
        };
        block_preserve_scale: true;
    };
    file_ids?: Array<literal_uuid>;                             // refer: file, upload only
};
