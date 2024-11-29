import type * as rt from './record-types';
import config from './config.js';
import markdownInline from './markdown-inline.js';
import Block, { CodeBlock, ImageBlock, TableBlock, TableRowBlock, ToDoBlock } from './block.js';
import log from './log.js';
import { newPropertyId } from './util.js';

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

const markdown2blocks = function (markdown: string) {
    // replace \tab to 4 spaces
    markdown = markdown.replace(/\t/g, '    ');
    // readlines from markdown eol maybe \n or \r\n
    const lines = markdown.split(/\r?\n/);
    // blocks
    const blocks = [] as any[];
    let index = -1;
    let flagLineSep = false;
    let inCodeBlock = false;
    let inEquationBlock = false;
    let inTableBlock = false;
    let inTableBlockIndex = -1;
    while (++index < lines.length) {
        const line = lines[index];
        const indent = Math.floor((line.match(/^\s*/)?.[0].length || 0) / 4);
        const trimline = line.trim();
        if (inCodeBlock) {
            if (trimline === '```') {
                inCodeBlock = false;
                flagLineSep = true;
            }
            else {
                const block = blocks[blocks.length - 1];
                block.content += line + '\n';
            }
            continue;
        }
        if (inEquationBlock) {
            if (trimline === '$$') {
                inEquationBlock = false;
                flagLineSep = true;
            }
            else {
                const block = blocks[blocks.length - 1];
                block.content += line + '\n';
            }
            continue;
        }
        if (inTableBlock) {
            const matchRow = trimline.match(/^\|(.*)\|$/);
            if (matchRow) {
                const props = matchRow[1].split('|');
                props.forEach((cell) => cell.trim());
                const tableBlock = blocks[inTableBlockIndex];
                const block = { type: 'table_row', indent: tableBlock.indent + 1, props, };
                blocks.push(block);
            }
            else {
                index--;
                inTableBlock = false;
                flagLineSep = true;
            }
            continue;
        }
        if (trimline === '') {
            flagLineSep = true;
            continue;
        }
        // match header
        const matchHeader = trimline.match(/^(#+)\s+(.*)$/);
        if (matchHeader) {
            const level = matchHeader[1].length;
            if (level === 1) {
                const block = { type: 'header', indent, content: matchHeader[2].trim(), };
                blocks.push(block);
            }
            else if (level === 2) {
                const block = { type: 'sub_header', indent, content: matchHeader[2].trim(), };
                blocks.push(block);
            }
            else if (level === 3) {
                const block = { type: 'sub_sub_header', indent, content: matchHeader[2].trim(), };
                blocks.push(block);
            }
            else {
                const block = { type: 'text', indent, content: matchHeader[2].trim(), };
                blocks.push(block);
            }
            continue;
        }
        // match list
        const matchList = trimline.match(/^([-+*])\s+(.*)$/);
        if (matchList) {
            const submatch = matchList[2].trim().match(/^(\[[ x]\])\s+(.*)$/);
            if (submatch) {
                const isChecked = submatch[1] === '[x]';
                const block = { type: 'to_do', indent, content: submatch[2].trim(), isChecked };
                blocks.push(block);
            }
            else {
                const block = { type: 'bulleted_list', indent, content: matchList[2].trim(), };
                blocks.push(block);
            }
            continue;
        }
        // match numbered list
        const matchNumbered = trimline.match(/^(\d+)\.\s+(.*)$/);
        if (matchNumbered) {
            const block = { type: 'numbered_list', indent, content: matchNumbered[2].trim(), };
            blocks.push(block);
            continue;
        }

        // match code block
        const matchCode = trimline.match(/^```(.*)$/);
        if (matchCode) {
            const language = matchCode[1] ?? 'Plain Text';
            const block = { type: 'code', indent, language: matchCode[1], content: '', };
            blocks.push(block);
            inCodeBlock = true;
            continue;
        }
        // match equation block
        if (trimline.startsWith('$$')) {
            if (trimline === '$$') {
                const block = { type: 'equation', indent, content: '', };
                blocks.push(block);
                inEquationBlock = true;
                continue;
            }
            const matchEquation = trimline.match(/^\$\$(.*)\$\$$/);
            if (matchEquation) {
                const block = { type: 'equation', indent, content: matchEquation[1], };
                blocks.push(block);
                continue;
            }
            throw new Error('Invalid equation block');
        }
        // match quote block
        const matchQuote = trimline.match(/^>\s+(.*)$/);
        if (matchQuote) {
            const block = { type: 'quote', indent, content: matchQuote[1].trim(), };
            blocks.push(block);
            continue;
        }
        // match table block
        const matchTable = trimline.match(/^\|(.*)\|$/);
        const matchTable2 = lines[index + 1].trim().match(/^\|([:|-\s]*)\|$/);
        if (matchTable && matchTable2) {
            const columnCount = matchTable2[1].split('|').length;
            const block = { type: 'table', indent, columnCount, };
            blocks.push(block);
            lines[index + 1] = lines[index];
            inTableBlock = true;
            inTableBlockIndex = blocks.length - 1;
            continue;
        }
        // match image block
        const matchImage = trimline.match(/^!\[(.*)\]\((.*)\)$/);
        if (matchImage) {
            const block = { type: 'image', indent, alt: matchImage[1], src: matchImage[2], };
            blocks.push(block);
            continue;
        }
        // match divider block
        if (trimline === '---' || trimline === '***' || trimline === '___') {
            const block = { type: 'divider', indent, };
            blocks.push(block);
            continue;
        }
        if (flagLineSep) {
            const block = { type: 'text', indent, content: trimline, };
            blocks.push(block);
        }
        else {
            const block = blocks[blocks.length - 1];
            if (block?.content) {
                block.content += '\n' + line;
            }
            else {
                const block = { type: 'text', indent, content: trimline, };
                blocks.push(block);
            }
        }
        flagLineSep = false;
    }
    const rootBlocks = [] as any[];
    const stack = [] as any[];
    for (let block of blocks) {
        while (stack.length > 0 && stack[stack.length - 1].indent >= block.indent) {
            stack.pop();
        }
        if (stack.length === 0) {
            rootBlocks.push(block);
        }
        else {
            const parent = stack[stack.length - 1];
            if (!parent.children) {
                parent.children = [];
            }
            parent.children.push(block);
        }
        stack.push(block);
    }
    return rootBlocks;
}

const createBlocks = async function (blocks: any[], parent: Block, state = {uploads: [] as any[]}) {
    const client = parent.client;
    for (let block of blocks) {
        switch (block.type) {
            case 'header': {
                const newBlock = await client.createBlock('header', 'child', parent);
                newBlock.title = block.content;
                await newBlock.idle();
                if (block.children) {
                    await createBlocks(block.children, parent, state);
                }
                break;
            }
            case 'sub_header': {
                const newBlock = await client.createBlock('sub_header', 'child', parent);
                newBlock.title = block.content;
                await newBlock.idle();
                if (block.children) {
                    await createBlocks(block.children, parent, state);
                }
                break;
            }
            case 'sub_sub_header': {
                const newBlock = await client.createBlock('sub_sub_header', 'child', parent);
                newBlock.title = block.content;
                await newBlock.idle();
                if (block.children) {
                    await createBlocks(block.children, parent, state);
                }
                break;
            }
            case 'to_do': {
                const newBlock = await client.createBlock('to_do', 'child', parent);
                newBlock.title = block.content;
                (newBlock as ToDoBlock).isChecked = block.isChecked;
                await newBlock.idle();
                if (block.children) {
                    await createBlocks(block.children, newBlock, state);
                }
                break;
            }
            case 'bulleted_list': {
                const newBlock = await client.createBlock('bulleted_list', 'child', parent);
                newBlock.title = block.content;
                await newBlock.idle();
                if (block.children) {
                    await createBlocks(block.children, newBlock, state);
                }
                break;
            }
            case 'numbered_list': {
                const newBlock = await client.createBlock('numbered_list', 'child', parent);
                newBlock.title = block.content;
                await newBlock.idle();
                if (block.children) {
                    await createBlocks(block.children, newBlock, state);
                }
                break;
            }
            case 'code': {
                const newBlock = await client.createBlock('code', 'child', parent);
                newBlock.titleText = block.content;
                (newBlock as CodeBlock).language = block.language;
                await newBlock.idle();
                if (block.children) {
                    await createBlocks(block.children, parent, state);
                }
                break;
            }
            case 'quote': {
                const newBlock = await client.createBlock('quote', 'child', parent);
                newBlock.title = block.content;
                await newBlock.idle();
                if (block.children) {
                    await createBlocks(block.children, newBlock, state);
                }
                break;
            }
            case 'equation': {
                const newBlock = await client.createBlock('equation', 'child', parent);
                newBlock.titleText = block.content;
                await newBlock.idle();
                if (block.children) {
                    await createBlocks(block.children, parent, state);
                }
                break;
            }
            case 'table': {
                const newBlock = await client.createBlock('table', 'child', parent);
                const ids = [];
                for (let i = 0; i < block.columnCount; i++) {
                    ids.push(newPropertyId());
                }
                await newBlock.set(['format', 'table_block_column_order'], ids);
                const record = newBlock.record as any;
                record.format = record.format ?? {};
                record.format.table_block_column_order = ids;

                if (block.children) {
                    await createBlocks(block.children, newBlock, state);
                }
                break;
            }
            case 'table_row': {
                const newBlock = await client.createBlock('table_row', 'child', parent);
                for (let i = 0; i < block.props.length; i++) {
                    await (newBlock as TableRowBlock).setProperty(i, block.props[i]);
                }
                if (block.children) {
                    await createBlocks(block.children, parent, state);
                }
                break;
            }
            case 'divider': {
                const newBlock = await client.createBlock('divider', 'child', parent);
                await newBlock.idle();
                if (block.children) {
                    await createBlocks(block.children, parent, state);
                }
                break;
            }
            case 'image': {
                const TRANS_IMAGE_TO_NOTION = (config as any)?.TRANS_IMAGE_TO_NOTION;
                if (TRANS_IMAGE_TO_NOTION) {
                    const blockPointer = await client.action.createBlock('image', 'child', parent.pointer);
                    await client.action.done(true);
                    state.uploads.push({ pointer: blockPointer, url: block.src });
                }
                else {
                    const newBlock = await client.createBlock('image', 'child', parent);
                    newBlock.title = block.alt;
                    (newBlock as ImageBlock).source = block.src;
                    await newBlock.idle();
                }
                if (block.children) {
                    await createBlocks(block.children, parent, state);
                }
                break;
            }
            default: {
                const newBlock = await client.createBlock('text', 'child', parent);
                newBlock.title = block.content;
                await newBlock.idle();
                if (block.children) {
                    await createBlocks(block.children, parent, state);
                }
                break;
            }
        }
    }
    return state;
}

const toChunk = async function (markdown: string, parent: Block) {
    const client = parent.client;
    const blocks = markdown2blocks(markdown);
    client.useTransaction('#markdown2chunk');
    const state = await createBlocks(blocks, parent);
    await client.submitTransaction('#markdown2chunk', false);
    if (state.uploads.length > 0) {
        client.useTransaction('#markdown2chunk');
        for (let upload of state.uploads) {
            const url = await client.action.uploadFile(upload.pointer, upload.url);
            await client.action.done(true);
        }
        await client.submitTransaction('#markdown2chunk', false);
    }
}


export default {
    fromChunk,
    toChunk,
    // toRichText,
    // plainTextFromRichText,
    // plainTextToRichText,
}
