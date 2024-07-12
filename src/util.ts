import { NOTION_BASE_URL } from './config.js';
import { ArgumentError, UnsupportedError } from './error.js';

export function uuid(id_or_url: string) {
    let re = id_or_url;
    if (/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(re)) {    // most common case
        return re;
    }
    if (re.startsWith(NOTION_BASE_URL)) {
        re = re.split("#").slice(-1)[0].split("/").slice(-1)[0].split("&p=").slice(-1)[0].split("?")[0].split("-").slice(-1)[0];
    }
    if (/^[a-f0-9]{32}$/i.test(re)) {
        return re.toLowerCase().replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5');
    }
    else if (/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(re)) {
        return re.toLowerCase();
    }
    else {
        throw new ArgumentError("uuid", "id_or_url", id_or_url);
    }
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
