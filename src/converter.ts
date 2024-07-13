import { DEBUG_MODE } from './config.js';
import { ArgumentError, UnsupportedError } from './error.js';

const RICHTEXT_COLOR = ['gray', 'brown', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'red'];
const RICHTEXT_BACKGROUND_COLOR = ['gray_background', 'brown_background', 'orange_background', 'yellow_background', 'green_background', 'blue_background', 'purple_background', 'pink_background', 'red_background'];
const RICHTEXT_STYLE_TAG = [
    'e',                        // equation
    'c',                        // code
    's',                        // strikethrough
    'i',                        // italic
    'b',                        // bold
    'a',                        // link
    '_',                        // underline
    'h',                        // highlight
    'm',                        // comment
];

const MARKDOWN_LINE_ESCAPE = [
    '\\',                       // escape
    '`',                        // code
    '*',                        // bold or italic
    '_',                        // bold or italic
    // '{',                        // footnote
    // '}',                        // footnote
    '[',                        // link
    ']',                        // link
    '(',                        // link
    ')',                        // link
    // '#',                        // header
    // '+',                        // list
    // '-',                        // list
    // '.',                        // list
    // '!'                         // image
    '<',                        // html
    '>',                        // html
    '~',                        // strikethrough
    '$',                        // equation
];

function charlist2regexp(charlist: string[], flags: string = 'g') {
    return new RegExp(`[${charlist.join('').replace(/[\\\]\^\-]/g, '\\$&')}]`, flags);
}

export function richtext2markdown(richText: any[]) {
    let markdown = '';
    for (const item of richText) {
        let origin = item[0] as string;
        let text = origin.replace(charlist2regexp(MARKDOWN_LINE_ESCAPE), '\\$&');
        text = text.replace(/\n/g, '<br>');
        const styles = item[1] || [];
        if (DEBUG_MODE)
            if (item[2])
                throw new UnsupportedError('richtext2markdown', item);
        if (DEBUG_MODE)
            for (const style of styles)
                if (!RICHTEXT_STYLE_TAG.includes(style[0]))
                    throw new UnsupportedError('richtext2markdown', style[0]);
        // sort
        styles.sort((a: any, b: any) => {
            if (RICHTEXT_STYLE_TAG.indexOf(a[0]) < RICHTEXT_STYLE_TAG.indexOf(b[0])) {
                return -1;
            }
            else {
                return 1;
            }
        });
        let style_html_str = '';
        for (const style of styles) {
            const tag = style[0] as string;
            const param = style[1] as string;
            switch (tag) {
                case 'e':
                    text = `\$${param}\$`;
                    break;
                case 'c':
                    text = `\`${origin}\``;
                    break;
                case 's':
                    text = `~~${text}~~`;
                    break;
                case 'i':
                    text = `*${text}*`;
                    break;
                case 'b':
                    text = `**${text}**`;
                    break;
                case 'a':
                    text = `[${text}](${param})`;
                    break;
                case '_':
                    text = `<u>${text}</u>`;
                    break;
                case 'h':
                    if (param === 'default') {
                        // nothing to do
                    }
                    else if (RICHTEXT_COLOR.includes(param)) {
                        style_html_str += `color: ${param}; `;
                    }
                    else if (RICHTEXT_BACKGROUND_COLOR.includes(param)) {
                        style_html_str += `background-color: ${param.split('_')[0]}; `;
                    }
                    else {
                        if (DEBUG_MODE)
                            throw new UnsupportedError('richtext2markdown', style);
                    }
                    break;
                default:
                    if (DEBUG_MODE)
                        throw new UnsupportedError('richtext2markdown', style);
            }
        }
        if (style_html_str) {
            text = `<span style="${style_html_str}">${text}</span>`;
        }
        markdown += text;
    }
    return markdown;
}

export const markdown2richtext = (() => {
    let richText: any[] = [];
    let text = '';
    let styles: string[][] = [];
    let codeMode: string | null = null;
    let escapeMode = false;
    let flagUnionHighlight = false;
    let flagSwapItalicBold = false;

    function push_text() {
        if (text.length > 0) {
            const styles_copy: string[][] = [];
            let flagDefaultHighlight = true;
            for (const style of styles) {
                const style_copy = style.slice();
                styles_copy.push(style_copy);
                if (style_copy[0] === 'h') {
                    flagDefaultHighlight = false;
                }
                else if (style_copy[0] === 'e') {
                    style_copy[1] = text;
                    text = '⁍';
                }
            }
            if (flagDefaultHighlight) {
                styles_copy.push(['h', 'default']);
            }
            richText.push([text, styles_copy]);
            text = '';
        }
    }
    function mark_tag(tag: string, status: 'open' | 'close' | 'toggle' = 'toggle', param?: string, magicFlag: boolean = false) {
        let found: boolean = false;
        for (let i = styles.length - 1; i >= 0; i--) {
            const style = styles[i];
            if (tag === style[0] && (!param || param === style[1])) {
                found = true;
                if (status === 'open') {
                    return false;
                }
                else {
                    if (i === styles.length - 1) {
                        status = 'close';
                        break
                    }
                    else if (i === styles.length - 2 && flagSwapItalicBold && (tag === 'b' || tag === 'i')) {
                        const lastTag = styles[styles.length - 1][0];
                        if ((lastTag === 'b' && tag === 'i') || (lastTag === 'i' && tag === 'b')) {
                            const temp = styles[styles.length - 1];
                            styles[styles.length - 1] = styles[styles.length - 2];
                            styles[styles.length - 2] = temp;
                            status = 'close';
                            break
                        }
                    }
                    return false;
                }
            }
        }
        if (status === 'close' && !found) {
            return false;
        }
        push_text();
        if (status === 'close') {
            styles.pop();
            if (flagUnionHighlight && tag === 'h') {
                if (styles.length > 0 && styles[styles.length - 1][0] === 'h') {
                    styles.pop();
                }
            }
            if (tag === 'c' || tag === 'e') {
                codeMode = null;
            }
        }
        else {
            if ((tag === 'b' || tag === 'i')) {
                const lastTag = styles[styles.length - 1]?.[0];
                flagSwapItalicBold = magicFlag && (lastTag === 'b' || lastTag === 'i');
            }
            else if (tag === 'h') {
                const lastTag = styles[styles.length - 1]?.[0];
                flagUnionHighlight = magicFlag && lastTag === 'h';
            }
            if (param) {
                styles.push([tag, param]);
            }
            else {
                styles.push([tag]);
            }
            if (tag === 'c' || tag === 'e') {
                codeMode = tag === 'c' ? '`' : '$';
            }
        }
        return true;
    }
    function parse_markdown(markdown: string, index: number, tailIndex: number) {
        while (index < tailIndex) {
            let c = markdown[index];
            if (escapeMode) {
                text += c;
                escapeMode = false;
            }
            else if (codeMode && (c !== codeMode || markdown[index - 1] === '\\')) {
                // console.log(c, codeMode)
                text += c;
            }
            else if (c === '\\') {
                escapeMode = true;
            }
            else if (c === '<') {
                const endIndex = markdown.indexOf('>', index);
                if (endIndex === -1) {
                    escapeMode = true;
                    continue;
                }
                let tag = markdown.slice(index + 1, endIndex).trim();
                let status: 'open' | 'close' | 'toggle' = 'open';
                if (tag[0] === '/') {
                    status = 'close';
                    tag = tag.slice(1).trimStart();
                }
                let tagname = tag.split(' ')[0];
                if (tagname === 'u') {
                    if (mark_tag('_', status)) {
                        index = endIndex + 1;
                        continue;
                    }
                }
                else if (tagname === 'span') {
                    if (status === 'open') {
                        let style_str = tag.match(/\bstyle\s*=\s*["']([^"']*?)["']/)?.[1];
                        if (style_str) {
                            let set = 0;
                            const style_table = style_str.split(';').map(x => x.split(':').map(y => y.trim()));
                            for (const style_item of style_table) {
                                const key = style_item[0];
                                console.log('??????????', key)
                                if (key === 'color') {
                                    let color = style_item[1];
                                    if (RICHTEXT_COLOR.includes(color) && mark_tag('h', status, color)) {
                                        set++;
                                    }
                                }
                                else if (key === 'background-color') {
                                    let background = style_item[1] + '_background';
                                    if (RICHTEXT_BACKGROUND_COLOR.includes(background) && mark_tag('h', status, background, set > 0)) {
                                        set++;
                                    }
                                }
                            }
                            console.log('html tag', index, c, markdown.length, tag, tagname, style_str, set);
                            if (set > 0) {
                                index = endIndex + 1;
                                continue;
                            }
                        }
                    }
                    else {
                        if (mark_tag('h', status)) {
                            index = endIndex + 1;
                            continue;
                        }
                    }
                }
                else if (tagname === 'br') {
                    text += '\n';
                    index = endIndex + 1;
                    continue;
                }
                text += c;
            }
            else if (c === '[') {
                const match = markdown.slice(index).match(/\[(.*?[^\\])\]\((.*?[^\\])\)/);
                if (match && mark_tag('a', 'open', match[2])) {
                    parse_markdown(match[1], 0, match[1].length);
                    mark_tag('a', 'close');
                    index += match[0].length;
                    continue;
                }
                text += c;
            }
            else if (c === '*') {
                if (markdown[index + 1] === '*') {
                    if (markdown[index + 2] === '*') {
                        mark_tag('b', 'toggle', undefined, true);
                        mark_tag('i', 'toggle', undefined, true);
                        index += 3;
                        continue;
                    }
                    else {
                        mark_tag('b');
                        index += 2;
                        continue;
                    }
                }
                else {
                    mark_tag('i');
                }
            }
            else if (c === '_') {
                if (markdown[index + 1] === '_') {
                    if (markdown[index + 2] === '_') {
                        mark_tag('b', 'toggle', undefined, true);
                        mark_tag('i', 'toggle', undefined, true);
                        index += 3;
                        continue;
                    }
                    else {
                        mark_tag('b');
                        index += 2;
                        continue;
                    }
                }
                else {
                    mark_tag('i');
                }
            }
            else if (c === '~') {
                if (markdown[index + 1] === '~' && mark_tag('s')) {
                    index += 2;
                    continue;
                }
                text += c;
            }
            else if (c === '`') {
                if (!mark_tag('c')) {
                    text += c;
                }
            }
            else if (c === '$') {
                if (!mark_tag('e')) {
                    text += c;
                }
            }
            else {
                text += c;
            }
            index++;
        }

    }
    return function (markdown: string) {
        richText = [];
        text = '';
        styles = [];
        codeMode = null;
        escapeMode = false;
        flagUnionHighlight = false;
        flagSwapItalicBold = false;
        parse_markdown(markdown, 0, markdown.length);
        push_text();
        return richText;
    };
})();
