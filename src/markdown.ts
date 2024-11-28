import type * as rt from './record-types';
import config from './config.js';
import markdownInline from './markdown-inline.js';
import Block, { CodeBlock, ImageBlock, TableBlock, TableRowBlock, ToDoBlock } from './block.js';
import log from './log.js';

const fromChunk = async function (children: Block[], indent: number = 0): Promise<string> {
    let markdownItems = [];
    for (let child of children) {
        if (indent > 0) {
            const prefix = ' '.repeat(indent * 4);
            markdownItems.push(prefix);
        }
        switch (child.type) {
            case 'text': {
                markdownItems.push('\n', child.title.replace(/\n/g, '<br>'), '\n');
                if (child.childCount > 0) {
                    markdownItems.push(await fromChunk(await child.getChildren(), indent + 1));
                }
                break;
            }
            case 'header': {
                markdownItems.push('# ', child.title.replace(/\n/g, '<br>'), '\n');
                if (child.childCount > 0) {
                    markdownItems.push(await fromChunk(await child.getChildren(), indent));
                }
                break;
            }
            case 'sub_header': {
                markdownItems.push('## ', child.title.replace(/\n/g, '<br>'), '\n');
                if (child.childCount > 0) {
                    markdownItems.push(await fromChunk(await child.getChildren(), indent));
                }
                break;
            }
            case 'sub_sub_header': {
                markdownItems.push('### ', child.title.replace(/\n/g, '<br>'), '\n');
                if (child.childCount > 0) {
                    markdownItems.push(await fromChunk(await child.getChildren(), indent));
                }
                break;
            }
            case 'to_do': {
                if ((child as ToDoBlock).isChecked) {
                    markdownItems.push('- [x] ', child.title.replace(/\n/g, '<br>'), '\n');
                }
                else {
                    markdownItems.push('- [ ] ', child.title.replace(/\n/g, '<br>'), '\n');
                }
                if (child.childCount > 0) {
                    markdownItems.push(await fromChunk(await child.getChildren(), indent + 1));
                }
                break;
            }
            case 'bulleted_list': {
                markdownItems.push('- ', child.title.replace(/\n/g, '<br>'), '\n');
                if (child.childCount > 0) {
                    markdownItems.push(await fromChunk(await child.getChildren(), indent + 1));
                }
                break;
            }
            case 'numbered_list': {
                markdownItems.push('1. ', child.title.replace(/\n/g, '<br>'), '\n');
                if (child.childCount > 0) {
                    markdownItems.push(await fromChunk(await child.getChildren(), indent + 1));
                }
                break;
            }
            case 'toggle': {
                markdownItems.push('- ', child.title.replace(/\n/g, '<br>'), '\n');
                if (child.childCount > 0) {
                    markdownItems.push( await fromChunk(await child.getChildren(), indent + 1));
                }
                break;
            }
            case 'code': {
                markdownItems.push('```', (child as CodeBlock).language, '\n', child.titleText, '\n```', '\n');
                const caption = (child as CodeBlock).caption;
                if (caption) {
                    markdownItems.push(caption, '\n');
                }
                break;
            }
            case 'quote': {
                if (child.title) {
                    markdownItems.push('> ', child.title.replace(/\n/g, '<br>'), '\n');
                }
                if (child.childCount > 0) {
                    let childtext = await fromChunk(await child.getChildren(), indent);
                    //add > to each line
                    childtext = childtext.replace(/\n/g, '\n> ');
                    markdownItems.push('> ', childtext);
                }
                break;
            }
            case 'callout': {
                if (child.title) {
                    markdownItems.push('> ', child.title.replace(/\n/g, '<br>'), '\n');
                }
                if (child.childCount > 0) {
                    let childtext = await fromChunk(await child.getChildren(), indent);
                    //add > to each line
                    childtext = childtext.replace(/\n/g, '\n> ');
                    markdownItems.push('> ', childtext);
                }
                break;
            }
            case 'equation': {
                markdownItems.push('$$\n', child.titleText, '\n$$', '\n');
                break;
            }
            case 'transclusion_container': {
                if (child.childCount > 0) {
                    markdownItems.push(await fromChunk(await child.getChildren(), indent));
                }
                break;
            }
            case 'transclusion_reference': {
                break;
            }
            case 'column_list': {
                if (child.childCount > 0) {
                    markdownItems.push(await fromChunk(await child.getChildren(), indent));
                }
                break;
            }
            case 'column': {
                if (child.childCount > 0) {
                    markdownItems.push(await fromChunk(await child.getChildren(), indent));
                }
                break;
            }
            case 'table': {
                const columnCount = (child as TableBlock).columnCount;
                if (child.childCount > 0) {
                    let childtext = await fromChunk(await child.getChildren(), indent);
                    // add table separator line to the second line
                    childtext = childtext.replace(/\n/, '\n|' + ' --- |'.repeat(columnCount) + '\n');
                    markdownItems.push(childtext);
                }
                break;
            }
            case 'table_row': {
                const columnCount = (await (child as TableRowBlock).getTable()).columnCount;
                for (let i = 0; i < columnCount; i++) {
                    markdownItems.push('| ', (await (child as TableRowBlock).getProperty(i)), ' ');
                }
                markdownItems.push('|', '\n');
                break;
            }
            case 'divider': {
                markdownItems.push('---', '\n');
                break;
            }
            case 'alias': {
                break;
            }
            case 'image': {
                markdownItems.push('![', child.title, '](', (child as ImageBlock).source, ')', '\n');
                const caption = (child as ImageBlock).caption;
                if (caption) {
                    markdownItems.push(caption, '\n');
                }
                break;
            }
            case 'page': {
                break;
            }
            case 'collection_view_page': {
                break;
            }
            case 'collection_view': {
                break;
            }
            default: {
                break;
            }
        }
    }
    let markdown = markdownItems.join('');
    return markdown;
};


export default {
    fromChunk,
    // toRichText,
    // plainTextFromRichText,
    // plainTextToRichText,
}
