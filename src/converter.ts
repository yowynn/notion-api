import type * as rt from './record-types';
import md from './markdown.js';

export const rt$date2text = function (date: rt.date) {
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

export const text2rt$date = function (text: string) {
    const date = text.split(' ');
    if (date.length === 1) {
        return { type: 'date', start_date: date[0].replace(/\//g, '-') };
    }
    if (date.length === 2) {
        return { type: 'datetime', start_date: date[0].replace(/\//g, '-'), start_time: date[1] };
    }
    if (date.length === 3) {
        return { type: 'daterange', start_date: date[0].replace(/\//g, '-'), end_date: date[2].replace(/\//g, '-') };
    }
    if (date.length === 4) {
        return { type: 'datetimerange', start_date: date[0].replace(/\//g, '-'), start_time: date[1], end_date: date[2].replace(/\//g, '-'), end_time: date[3] };
    }
    throw new Error('Invalid date format');
}

export const markdown2richtext = function (markdown: string) {
    return md.toRichText(markdown);
}

export const richtext2markdown = function (richtext: rt.rich_text) {
    return md.fromRichText(richtext);
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

export const decodeProperty = function (type: rt.type_of_schema, value: rt.rich_text) {
    switch (type) {
        case 'array':
            throw new Error('Not implemented');
        case 'unknown':
            return value ? value[0][0] : null;
        case 'title':
            return md.fromRichText(value);
        case 'text':
            return md.fromRichText(value);
        case 'number':
            return value ? Number(value[0][0]) : null;
        case 'select':
            return value ? value[0][0] : null;
        case 'multi_select':
            return value ? md.fromRichText(value).split(',') : [];
        case 'status':
            return value ? value[0][0] : null;
        case 'date':
            return value ? rt$date2text((value[0][1] as rt.annotation_date[])[0][1]) : null;
        case 'person':
            return value ? value.filter((_, i) => i % 2 === 0).map(v => (v[1] as rt.annotation_user[])[0][1]) : null;
        case 'file':
            return value ? value.filter((_, i) => i % 2 === 0) as [string, [rt.annotation_link]][] : null;
        case 'checkbox':
            return value ? value[0][0] === 'Yes' : false;
        case 'url':
            return value ? value[0][0] : null;
        case 'email':
            return value ? value[0][0] : null;
        case 'phone_number':
            return value ? value[0][0] : null;
        case 'formula':
            throw new Error('Not implemented');
        case 'relation':
            return value ? value.filter((_, i) => i % 2 === 0).map(v => (v[1] as rt.annotation_link[])[0][1]) : null;
        case 'rollup':
            throw new Error('Not implemented');
        case 'created_time':
            throw new Error('Not implemented');
        case 'created_by':
            throw new Error('Not implemented');
        case 'last_edited_time':
            throw new Error('Not implemented');
        case 'last_edited_by':
            throw new Error('Not implemented');
        case 'auto_increment_id':
            return value ? value[0][0] : null;
        case 'button':
            throw new Error('Not implemented');
    }
}

export const encodeProperty = function (type: rt.type_of_schema, value: any): rt.rich_text | null {
    if (value === null) {
        return null;
    }
    switch (type) {
        case 'array':
            throw new Error('Not implemented');
        case 'unknown':
            return [[value]];
        case 'title':
            return md.toRichText(value);
        case 'text':
            return md.toRichText(value);
        case 'number':
            return [[value.toString()]];
        case 'select':
            return [[value]];
        case 'multi_select':
            return md.toRichText(value.join(','));
        case 'status':
            return [[value]];
        case 'date':
            return [['‣', [['d', text2rt$date(value) as rt.date]]]];
        case 'person':
            return ((value as rt.string_uuid[]).flatMap(v => [['‣', [['u', v]]], [',']]) as rt.rich_text).slice(0, -1);
        case 'file':
            return ((value as [string, [rt.annotation_link]][]).flatMap(v => [v, [',']]) as rt.rich_text).slice(0, -1);
        case 'checkbox':
            return [[value ? 'Yes' : 'No']];
        case 'url':
            return [[value, [['a', value]]]];
        case 'email':
            return [[value, [['a', 'mailto:' + value]]]];
        case 'phone_number':
            return [[value, [['a', value]]]];
        case 'formula':
            throw new Error('Not implemented');
        case 'relation':
            return ((value as rt.string_uuid[]).flatMap(v => [['‣', [['p', v]]], [',']]) as rt.rich_text).slice(0, -1);
        case 'rollup':
            throw new Error('Not implemented');
        case 'created_time':
            throw new Error('Not implemented');
        case 'created_by':
            throw new Error('Not implemented');
        case 'last_edited_time':
            throw new Error('Not implemented');
        case 'last_edited_by':
            throw new Error('Not implemented');
        case 'auto_increment_id':
            return [[value]];
        case 'button':
            throw new Error('Not implemented');
    }
}

export const dp = function (type: rt.type_of_schema) {
    return (value: rt.rich_text) => decodeProperty(type, value);
}

export const ep = function (type: rt.type_of_schema) {
    return (value: any) => encodeProperty(type, value);
}
