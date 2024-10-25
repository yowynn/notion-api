import type * as rt from './record-types';
import config from './config.js';
import log from './log.js';
import { rt$date2text } from './converter.js';
import { ArgumentError, UnsupportedError } from './error.js';

const ORDERED_ANNOTATION_TAG: rt.mark_of_annotation[] = [
    'p',                                                        // Page mention
    'u',                                                        // User mention
    'd',                                                        // Date mention
    'tv',                                                       // Template variable mention
    'e',                                                        // Equation
    'c',                                                        // Code
    's',                                                        // Strikethrough
    'i',                                                        // Italic
    'b',                                                        // Bold
    'a',                                                        // Link
    '_',                                                        // Underline
    'h',                                                        // Highlight
    // * unsupported below
    'm',                                                        // Margin comment
    'sa',                                                       // Suggested annotation
    'sua',                                                      // Suggested un-annotation
    'si',                                                       // Suggested insertion
    'sr',                                                       // Suggested removal
];

const MARKDOWN_ESCAPE_CHARLIST = [
    '\\',                       // backslash, used to escape characters
    '`',                        // backtick, used to create code blocks
    '*',                        // asterisk, used for bold and italic text, and bullet lists
    '_',                        // underscore, used for bold and italic text
    '{',                        // curly braces, used for variables, and footnotes
    '}',                        // ——
    '[',                        // brackets, used for links and images
    ']',                        // ——
    '(',                        // ——
    ')',                        // ——
    '<',                        // angle brackets, used for html tags
    '>',                        // ——
    '#',                        // pound sign, used for headers
    '+',                        // plus sign, used for lists
    '-',                        // minus sign, used for lists
    '.',                        // dot, used for lists
    '!',                        // exclamation mark, used for images
    '|',                        // pipe, used for tables
    '~',                        // tilde, used for strikethrough
    '$',                        // dollar sign, used for math
    // ':',                        // colon, used for tables
];

const MARKDOWN_ESCAPE_REGEX = new RegExp(`[${MARKDOWN_ESCAPE_CHARLIST.join('').replace(/[\\\]\^\-]/g, '\\$&')}]`, 'g');

const EMPTY = [] as any[];

const fromRichText = function (richText: rt.rich_text, useHtmlTags: boolean = true, reference: rt.pointer_to_record[] = []) {
    let markdown = '';
    let boldAlt = false;
    for (const item of richText ?? EMPTY) {
        let styles = '';
        let text = item[0];
        let annotations = item[1] ?? EMPTY as rt.annotation[];
        text = text.replace(MARKDOWN_ESCAPE_REGEX, '\\$&');
        annotations = annotations.slice().sort((a, b) => ORDERED_ANNOTATION_TAG.indexOf(a[0]) - ORDERED_ANNOTATION_TAG.indexOf(b[0]));
        for (const annotation of annotations) {
            const tag = annotation[0];
            switch (tag) {
                case 'b': {
                    text = boldAlt ? `__${text}__` : `**${text}**`;
                    break;
                }
                case 'i': {
                    text = boldAlt ? `_${text}_` : `*${text}*`;
                    break;
                }
                case '_': {
                    text = useHtmlTags ? `<u>${text}</u>` : text;
                    break;
                }
                case 's': {
                    text = `~~${text}~~`;
                    break;
                }
                case 'c': {
                    text = `\`${text}\``;
                    break;
                }
                case 'e': {
                    const equation = annotation[1];
                    text = `$${equation}$`;
                    break;
                }
                case 'h': {
                    let color = annotation[1] as string
                    let style = 'color';
                    if (color.endsWith('_background')) {
                        color = color.slice(0, -11);
                        style = 'background-color';
                    }
                    if (color !== 'default') {
                        styles += `${style}: ${color}; `;
                    }
                    break;
                }
                case 'a': {
                    const url = annotation[1];
                    text = `[${text}](${url})`;
                    break;
                }
                case 'u': {
                    const userId = annotation[1];
                    if (useHtmlTags) {
                        text = `<notion notion_user="${userId}">@${text}</notion>`;
                    }
                    reference.push({ table: 'notion_user', id: userId });
                    break;
                }
                case 'd': {
                    const date = annotation[1];
                    text = rt$date2text(date);
                    if (useHtmlTags) {
                        text = `<notion date="${Buffer.from(JSON.stringify(date)).toString('base64')}">${text}</notion>`;
                    }
                    break;
                }
                case 'tv': {
                    const tv = annotation[1];
                    text = `@${tv.type}`
                    if (useHtmlTags) {
                        text = `<notion template_variable="${tv.type}">${text}</notion>`;
                    }
                    break;
                }
                case 'p': {
                    const blockId = annotation[1];
                    if (useHtmlTags) {
                        text = `<notion block="${blockId}">${text}</notion>`;
                    }
                    reference.push({ table: 'block', id: blockId });
                    break;
                }
                case 'm':
                case 'sa':
                case 'sua':
                case 'si':
                case 'sr':
                    // ignore
                    break;
                default: {
                    if (config.DEBUG_MODE)
                        throw new UnsupportedError('markdown_from_rich_text', tag);
                }
            }
        }
        if (styles !== '') {
            text = `<span style="${styles}">${text}</span>`;
        }
        markdown += text;
    }
    return markdown;
}

const toRichText = function (markdown: string) {
    const parseHtmlTag = (tag: string) => {
        const match = tag.match(/<(\/?)([a-zA-Z0-9-]+)([^>]*)(\/?)>/);
        if (!match) {
            throw new ArgumentError('parse_tag', 'tag', tag, 'Invalid tag');
        }
        const isCloseTag = match[1] === '/';
        const tagName = match[2];
        const attributes = {} as { [key: string]: string; };
        const attrMatch = match[3].match(/([a-zA-Z0-9-]+)="(.*?)"/g);
        if (attrMatch) {
            for (const attr of attrMatch) {
                const [_, key, value] = attr.match(/([a-zA-Z0-9-]+)="(.*?)"/) as RegExpMatchArray;
                attributes[key] = value;
            }
        }
        const isSelfClosed = match[4] === '/';
        return { tag: tagName, attributes, isCloseTag, isSelfClosed };
    }
    const richText = [] as rt.rich_text;
    let text = '';
    let annotations = [] as rt.annotation[];
    const pushText = () => {
        if (text) {
            richText.push([text, [...annotations]]);
            text = '';
        }
    };
    let index = 0;
    let count = markdown.length;
    let escape = false;
    let stack = [''];
    let lastp = 0;
    while (true) {
        let char = markdown[index];
        if (!char) {
            pushText();
            break;
        }
        else if (escape) {
            text += char;
            escape = false;
        }
        else if (char === '\\') {
            escape = true;
        }
        else if (char === '*') {
            pushText();
            const sign_b = markdown[index + 1] === '*';
            const sign_i = markdown[index + 1] !== '*' || markdown[index + 2] === '*';
            const tag = stack[lastp];
            if (tag === '*' && sign_i) {
                const i = annotations.pop(); // pop i
                lastp--;
            }
            else if (tag === '**' && sign_b) {
                const b = annotations.pop(); // pop b
                lastp--;
                index += 1;
            }
            else if (tag === '***') {
                const i = annotations.pop()!; // pop i
                if (sign_i) {
                    if (sign_b) {
                        const b = annotations.pop()!; // pop b
                        lastp--;
                        index += 2;
                    }
                    else {
                        stack[lastp] = '**';
                    }
                }
                else {
                    const b = annotations.pop()!; // pop b
                    annotations.push(i);
                    stack[lastp] = '*';
                    index += 1;
                }
            }
            else {
                if (sign_b) {
                    annotations.push(['b']);
                    if (sign_i) {
                        annotations.push(['i']);
                        stack[++lastp] = '***';
                        index += 2;
                    }
                    else {
                        stack[++lastp] = '**';
                        index += 1;
                    }
                }
                else {
                    annotations.push(['i']);
                    stack[++lastp] = '*';
                }
            }
        }
        else if (char === '_') {
            pushText();
            const sign_b = markdown[index + 1] === '_';
            const sign_i = markdown[index + 1] !== '_' || markdown[index + 2] === '_';
            const tag = stack[lastp];
            if (tag === '_' && sign_i) {
                const i = annotations.pop(); // pop i
                lastp--;
            }
            else if (tag === '__' && sign_b) {
                const b = annotations.pop(); // pop b
                lastp--;
                index += 1;
            }
            else if (tag === '___') {
                const i = annotations.pop()!; // pop i
                if (sign_i) {
                    if (sign_b) {
                        const b = annotations.pop()!; // pop b
                        lastp--;
                        index += 2;
                    }
                    else {
                        stack[lastp] = '__';
                    }
                }
                else {
                    const b = annotations.pop()!; // pop b
                    annotations.push(i);
                    stack[lastp] = '_';
                    index += 1;
                }
            }
            else {
                if (sign_b) {
                    annotations.push(['b']);
                    if (sign_i) {
                        annotations.push(['i']);
                        stack[++lastp] = '___';
                        index += 2;
                    }
                    else {
                        stack[++lastp] = '__';
                        index += 1;
                    }
                }
                else {
                    annotations.push(['i']);
                    stack[++lastp] = '_';
                }
            }
        }
        else if (char === '~') {
            if (markdown[index + 1] === '~') {
                pushText();
                if (stack[lastp] === '~~') {
                    const s = annotations.pop()!; // pop s
                    lastp--;
                }
                else {
                    annotations.push(['s']);
                    stack[++lastp] = '~~';
                }
                index++;
            }
            else {
                text += char;
            }
        }
        else if (char === '`') {
            pushText();
            let count = 0;
            while (char = markdown[index + ++count]) {
                if (char === '`') {
                    if (markdown[index + count + 1] === '`') {
                        count++;
                    }
                    else {
                        break;
                    }
                }
            }
            annotations.push(['c']);
            text = markdown.slice(index + 1, index + count).replace(/``/g, '`');
            pushText();
            annotations.pop();
            index += count;
        }
        else if (char === '$') {
            pushText();
            let count = 0;
            let subEscape = false;
            while (char = markdown[index + ++count]) {
                if (subEscape) {
                    subEscape = false;
                }
                else if (char === '\\') {
                    subEscape = true;
                }
                else if (char === '$') {
                    break;
                }
            }
            annotations.push(['e', markdown.slice(index + 1, index + count)]);
            text = '⁍';
            pushText();
            annotations.pop();
            index += count;
        }
        else if (char === '[') {
            pushText();
            annotations.push(['a', '']);
            stack[++lastp] = '[';
        }
        else if (char === ']') {
            if (stack[lastp] === '[') {
                pushText();
                const a = annotations.pop()!; // pop a
                lastp--;
                if (markdown[index + 1] === '(') {
                    const end = markdown.indexOf(')', index);
                    const url = markdown.slice(index + 2, end);
                    a[1] = url;
                    index = end;
                }
            }
            else {
                text += char;
            }
        }
        else if (char === '<') {
            const end = markdown.indexOf('>', index);
            const tagInfo = parseHtmlTag(markdown.slice(index, end + 1));
            const [tag, annotationCountText] = stack[lastp].split(':');
            if (tagInfo.isCloseTag && tag === tagInfo.tag) {
                const annotationCount = annotationCountText ? Number(annotationCountText) : 1;
                if (tagInfo.tag === 'notion') {
                    text = '‣';
                }
                pushText();
                for (let i = 0; i < annotationCount; i++) {
                    annotations.pop();
                }
                lastp--;
            }
            else {
                switch (tagInfo.tag) {
                    case 'br': {
                        text += '\n';
                    }
                    case 'u': {
                        pushText();
                        annotations.push(['_']);
                        stack[++lastp] = 'u';
                        break;
                    }
                    case 'span': {
                        pushText();
                        const style = tagInfo.attributes.style;
                        if (style) {
                            const styles = {} as { [key: string]: string; };
                            const match = style.match(/([a-zA-Z0-9-]+): ([^;]+);/g);
                            if (match) {
                                for (const s of match) {
                                    const [_, key, value] = s.match(/([a-zA-Z0-9-]+): ([^;]+);/) as RegExpMatchArray;
                                    styles[key] = value;
                                }
                            }
                            const color = styles.color;
                            const backgroundColor = styles['background-color'];
                            let count = 0;
                            if (color) {
                                annotations.push(['h', color as rt.option_color]);
                                count++;
                            }
                            if (backgroundColor) {
                                annotations.push(['h', `${backgroundColor}_background` as rt.option_color]);
                                count++;
                            }
                        }
                        stack[++lastp] = 'span' + `:${count}`;
                        break;
                    }
                    case 'notion': {
                        pushText();
                        const date = tagInfo.attributes.date;
                        const user = tagInfo.attributes.notion_user as rt.string_uuid;
                        const block = tagInfo.attributes.block as rt.string_uuid;
                        const tv = tagInfo.attributes.template_variable as rt.option_template_variable;
                        if (date) {
                            annotations.push(['d', JSON.parse(Buffer.from(date, 'base64').toString())]);
                        }
                        else if (user) {
                            annotations.push(['u', user]);
                        }
                        else if (block) {
                            annotations.push(['p', block]);
                        }
                        else if (tv) {
                            annotations.push(['tv', { type: tv }]);
                        }
                        stack[++lastp] = 'notion';
                        break;
                    }
                    default: {
                        // ignore
                    }
                }
            }
            index = end;
        }
        else {
            text += char;
        }
        index++;
    }
    return richText;
};

export default {
    fromRichText,
    toRichText,
}
