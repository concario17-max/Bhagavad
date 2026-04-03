export interface CommentaryParagraphBlock {
    type: 'paragraph';
    text: string;
}

export interface CommentaryHeadingBlock {
    type: 'heading';
    text: string;
}

export interface CommentaryOrderedListBlock {
    type: 'ordered_list';
    items: string[];
}

export interface CommentaryBulletListBlock {
    type: 'bullet_list';
    items: string[];
}

export interface CommentaryTableBlock {
    type: 'table';
    rows: string[][];
}

export type CommentaryBlock =
    | CommentaryParagraphBlock
    | CommentaryHeadingBlock
    | CommentaryOrderedListBlock
    | CommentaryBulletListBlock
    | CommentaryTableBlock;

export interface ParsedCommentaryDocument {
    inlineHeading: string | null;
    blocks: CommentaryBlock[];
}

const normalizeLines = (commentary: string): string[] => (
    commentary
        .replace(/\r\n/g, '\n')
        .split('\n')
        .map(line => line.trim())
);

const isOrderedListLine = (line: string): boolean => /^\d+\.\s+/.test(line);

const isBulletListLine = (line: string): boolean => /^·\s+/.test(line);

const isTableLine = (line: string): boolean => /^\|.*\|$/.test(line);

const isSeparatorRow = (cells: string[]): boolean => (
    cells.length > 0 &&
    cells.every(cell => /^:?-{3,}:?$/.test(cell))
);

const parseTableRow = (line: string): string[] => (
    line
        .slice(1, -1)
        .split('|')
        .map(cell => cell.trim())
);

const pushParagraphBlock = (blocks: CommentaryBlock[], lines: string[]): void => {
    const text = lines.join(' ').trim();
    if (text !== '') {
        blocks.push({ type: 'paragraph', text });
    }
};

export const parseCommentaryDocument = (commentary: string): ParsedCommentaryDocument => {
    const lines = normalizeLines(commentary);
    const blocks: CommentaryBlock[] = [];
    let inlineHeading: string | null = null;
    let index = 0;

    while (index < lines.length) {
        const line = lines[index];

        if (line === '') {
            index += 1;
            continue;
        }

        if (line.startsWith('# ')) {
            const headingText = line.slice(2).trim();
            if (headingText !== '') {
                inlineHeading = inlineHeading ?? headingText;
            }
            index += 1;
            continue;
        }

        if (line.startsWith('## ')) {
            const headingText = line.slice(3).trim();
            if (headingText !== '') {
                blocks.push({ type: 'heading', text: headingText });
            }
            index += 1;
            continue;
        }

        if (isOrderedListLine(line)) {
            const items: string[] = [];
            while (index < lines.length && isOrderedListLine(lines[index])) {
                items.push(lines[index].replace(/^\d+\.\s+/, '').trim());
                index += 1;
            }
            blocks.push({ type: 'ordered_list', items });
            continue;
        }

        if (isBulletListLine(line)) {
            const items: string[] = [];
            while (index < lines.length && isBulletListLine(lines[index])) {
                items.push(lines[index].replace(/^·\s+/, '').trim());
                index += 1;
            }
            blocks.push({ type: 'bullet_list', items });
            continue;
        }

        if (isTableLine(line)) {
            const rows: string[][] = [];
            while (index < lines.length && isTableLine(lines[index])) {
                rows.push(parseTableRow(lines[index]));
                index += 1;
            }

            if (rows.length > 1 && isSeparatorRow(rows[1])) {
                rows.splice(1, 1);
            }

            if (rows.length > 0) {
                blocks.push({ type: 'table', rows });
            }
            continue;
        }

        const paragraphLines: string[] = [];
        while (
            index < lines.length &&
            lines[index] !== '' &&
            !lines[index].startsWith('# ') &&
            !lines[index].startsWith('## ') &&
            !isOrderedListLine(lines[index]) &&
            !isBulletListLine(lines[index]) &&
            !isTableLine(lines[index])
        ) {
            paragraphLines.push(lines[index]);
            index += 1;
        }

        pushParagraphBlock(blocks, paragraphLines);
    }

    return {
        inlineHeading,
        blocks
    };
};
