import { config } from './config.js';
import { ArgumentError, UnsupportedError } from './error.js';
import { from_rich_text, to_rich_text } from './markdown.js';
import * as rt from './record-types.js';

export const rt$date2string = function (date: rt.date) {
    switch (date.type) {
        case 'date':
            return date.start_date.replace(/-/g, '/');
        case 'datetime':
            return `${date.start_date.replace(/-/g, '/')} ${date.start_time}`;
        case 'daterange':
            return `${date.start_date.replace(/-/g, '/')} → ${date.end_date.replace(/-/g, '/')}`;
        case 'datetimerange':
            return `${date.start_date.replace(/-/g, '/')} ${date.start_time} → ${date.end_date.replace(/-/g, '/')} ${date.end_time}`;
    }
}


export const markdown2richtext = function (markdown: string) {
    return to_rich_text(markdown);
}

export const richtext2markdown = function (richtext: rt.rich_text) {
    return from_rich_text(richtext);
}

export function timestamp2date(number: number) {
    return new Date(number);
}

export function date2timestamp(date: Date) {
    return date.getTime();
}

export function date2string(date: Date) {
    return date.toLocaleString();
}

export function string2date(string: string) {
    return new Date(string);
}
