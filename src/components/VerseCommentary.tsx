import { ChevronLeft, ChevronRight, BookOpenText } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useVerseData } from '../context/VerseDataContext';
import { CommentaryBlock, parseCommentaryDocument } from '../utils/commentary';

type CommentaryMode = 'summary' | 'translation' | 'keywords';

interface VerseCommentaryProps {
    canGoNext?: boolean;
    canGoPrevious?: boolean;
    onNext?: () => void;
    onPrevious?: () => void;
    verseLabel?: string;
}

const STORAGE_PREFIX = 'gita:verse-commentary-section';

const getStorageKey = (chapterNum: string, verseRange: string) => `${STORAGE_PREFIX}:${chapterNum}:${verseRange}`;

const keywordLinePattern = /^\u{1F511}\s*\uD575\uC2EC\s*\uD0A4\uC6CC\uB4DC\s*[:\uFF1A]\s*(.+)$/u;
const summaryHeadingPattern = /\uC694\uC57D/u;

const isKeywordParagraph = (block: CommentaryBlock): boolean => (
    block.type === 'paragraph' && keywordLinePattern.test(block.text)
);

const extractKeywordItems = (commentary: string): string[] => {
    const keywordLine = commentary
        .replace(/\r\n/g, '\n')
        .split('\n')
        .map(line => line.trim())
        .find(line => keywordLinePattern.test(line));

    if (!keywordLine) {
        return [];
    }

    const match = keywordLine.match(keywordLinePattern);
    if (!match) {
        return [];
    }

    return match[1]
        .split(/[,\uFF0C\/|\u00B7]/)
        .map(item => item.trim())
        .filter(Boolean);
};

const findSummaryHeadingIndex = (blocks: CommentaryBlock[]): number => (
    blocks.findIndex(block => block.type === 'heading' && summaryHeadingPattern.test(block.text))
);

const renderCommentaryBlocks = (blocks: CommentaryBlock[]) => (
    <div className="space-y-4 text-[14px] leading-relaxed text-text-primary dark:text-dark-text-primary">
        {blocks.map((block, index) => {
            if (block.type === 'paragraph') {
                return <p key={`paragraph-${index}`}>{block.text}</p>;
            }

            if (block.type === 'heading') {
                return (
                    <h3 key={`heading-${index}`} className="pt-1 text-sm font-bold tracking-wide text-gold-primary dark:text-gold-light">
                        {block.text}
                    </h3>
                );
            }

            if (block.type === 'ordered_list') {
                return (
                    <ol key={`ordered-${index}`} className="list-decimal space-y-2 pl-5">
                        {block.items.map((item, itemIndex) => (
                            <li key={`ordered-item-${index}-${itemIndex}`}>{item}</li>
                        ))}
                    </ol>
                );
            }

            if (block.type === 'bullet_list') {
                return (
                    <ul key={`bullet-${index}`} className="space-y-2">
                        {block.items.map((item, itemIndex) => (
                            <li key={`bullet-item-${index}-${itemIndex}`} className="flex gap-2">
                                <span className="shrink-0 text-gold-primary dark:text-gold-light">-</span>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                );
            }

            return (
                <div key={`table-${index}`} className="overflow-x-auto rounded-xl border border-gold-primary/10">
                    <table className="min-w-full border-collapse text-left text-[13px]">
                        <tbody>
                            {block.rows.map((row, rowIndex) => (
                                <tr key={`table-row-${index}-${rowIndex}`} className={rowIndex === 0 ? 'bg-gold-surface/40 dark:bg-dark-surface/60' : ''}>
                                    {row.map((cell, cellIndex) => (
                                        <td key={`table-cell-${index}-${rowIndex}-${cellIndex}`} className="border border-gold-primary/10 px-3 py-2 align-top">
                                            {cell}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        })}
    </div>
);

const VerseCommentary = ({
    canGoNext = false,
    canGoPrevious = false,
    onNext,
    onPrevious,
    verseLabel
}: VerseCommentaryProps) => {
    const { chapterNum, errorMessage, hasDisplayableCommentary, status, verseData, verseRange } = useVerseData();
    const commentary = verseData?.commentary_en?.trim() ?? '';
    const parsedCommentary = hasDisplayableCommentary ? parseCommentaryDocument(commentary) : null;
    const summaryHeadingIndex = parsedCommentary ? findSummaryHeadingIndex(parsedCommentary.blocks) : -1;
    const summaryBlocks = parsedCommentary && summaryHeadingIndex >= 0
        ? parsedCommentary.blocks.slice(summaryHeadingIndex + 1)
        : [];
    const translationBlocks = parsedCommentary
        ? parsedCommentary.blocks
            .slice(0, summaryHeadingIndex >= 0 ? summaryHeadingIndex : parsedCommentary.blocks.length)
            .filter(block => !isKeywordParagraph(block))
        : [];
    const keywordItems = useMemo(() => extractKeywordItems(commentary), [commentary]);
    const [storedMode, setStoredMode] = useState<CommentaryMode>('summary');

    useEffect(() => {
        if (typeof window === 'undefined' || !chapterNum || !verseRange) {
            return;
        }

        const savedMode = window.localStorage.getItem(getStorageKey(chapterNum, verseRange));
        if (savedMode === 'summary' || savedMode === 'translation' || savedMode === 'keywords') {
            setStoredMode(savedMode);
            return;
        }

        setStoredMode('summary');
    }, [chapterNum, verseRange]);

    useEffect(() => {
        if (typeof window === 'undefined' || !chapterNum || !verseRange) {
            return;
        }

        window.localStorage.setItem(getStorageKey(chapterNum, verseRange), storedMode);
    }, [chapterNum, storedMode, verseRange]);

    const handleModeChange = (nextMode: CommentaryMode) => {
        if (typeof window === 'undefined' || !chapterNum || !verseRange) {
            return;
        }

        setStoredMode(nextMode);
        window.localStorage.setItem(getStorageKey(chapterNum, verseRange), nextMode);
    };

    const isHiddenInlineHeadingVerse = chapterNum === '1' && (verseRange === '1' || verseRange === '15');
    const shouldShowInlineHeading = !isHiddenInlineHeadingVerse && parsedCommentary?.inlineHeading !== null;
    const hasNavigation = onNext !== undefined || onPrevious !== undefined;
    const verseHeaderLabel = verseLabel ?? (chapterNum && verseRange ? `${chapterNum}.${verseRange}` : '');
    const currentBlocks = storedMode === 'summary'
        ? summaryBlocks
        : storedMode === 'translation'
            ? translationBlocks
            : [];

    return (
        <section className="rounded-[34px] border border-gold-primary/15 bg-white/72 p-4 shadow-[0_22px_80px_-48px_rgba(78,56,22,0.52)] backdrop-blur-xl dark:border-dark-border/70 dark:bg-dark-surface/72 sm:p-6">
            <div className="mb-5 border-b border-gold-border/30 pb-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <BookOpenText className="h-5 w-5 text-[#A68B5C] dark:text-gold-light" />
                        <h2 className="text-sm font-bold tracking-wide text-[#1C2B36] dark:text-dark-text-primary">Commentary</h2>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {hasNavigation && (
                            <div className="inline-flex items-center gap-2 rounded-full border border-gold-primary/15 bg-white/75 px-2 py-1.5 shadow-lg shadow-black/5 backdrop-blur-md transition-shadow hover:shadow-xl dark:border-dark-border/70 dark:bg-dark-surface/75 sm:px-2.5">
                                <button
                                    type="button"
                                    onClick={onPrevious}
                                    disabled={!canGoPrevious || !onPrevious}
                                    aria-label="Previous verse"
                                    className="rounded-full p-1.5 text-[#5B7282] transition-colors hover:bg-gold-surface/50 disabled:cursor-not-allowed disabled:opacity-30 dark:text-dark-text-secondary dark:hover:bg-[#222]"
                                >
                                    <ChevronLeft className="h-4.5 w-4.5 stroke-[1.5]" />
                                </button>

                                <span className="px-2 text-[15px] font-bold tracking-wide text-[#1C2B36] dark:text-dark-text-primary">
                                    {verseHeaderLabel}
                                </span>

                                <button
                                    type="button"
                                    onClick={onNext}
                                    disabled={!canGoNext || !onNext}
                                    aria-label="Next verse"
                                    className="rounded-full p-1.5 text-[#5B7282] transition-colors hover:bg-gold-surface/50 disabled:cursor-not-allowed disabled:opacity-30 dark:text-dark-text-secondary dark:hover:bg-[#222]"
                                >
                                    <ChevronRight className="h-4.5 w-4.5 stroke-[1.5]" />
                                </button>
                            </div>
                        )}

                        <div className="inline-flex rounded-full border border-gold-border/60 bg-white/80 p-1 text-xs font-semibold tracking-wide text-[#5A4630] shadow-sm dark:border-dark-border/70 dark:bg-dark-bg/50 dark:text-dark-text-secondary">
                            <button
                                type="button"
                                onClick={() => handleModeChange('summary')}
                                aria-pressed={storedMode === 'summary'}
                                className={`rounded-full px-3 py-1.5 transition ${
                                    storedMode === 'summary'
                                        ? 'bg-gold-primary text-white dark:bg-gold-light dark:text-[#1C2B36]'
                                        : 'text-[#5A4630] hover:text-gold-primary dark:text-dark-text-secondary dark:hover:text-gold-light'
                                }`}
                            >
                                Summary
                            </button>
                            <button
                                type="button"
                                onClick={() => handleModeChange('translation')}
                                aria-pressed={storedMode === 'translation'}
                                className={`rounded-full px-3 py-1.5 transition ${
                                    storedMode === 'translation'
                                        ? 'bg-gold-primary text-white dark:bg-gold-light dark:text-[#1C2B36]'
                                        : 'text-[#5A4630] hover:text-gold-primary dark:text-dark-text-secondary dark:hover:text-gold-light'
                                }`}
                            >
                                Translation
                            </button>
                            <button
                                type="button"
                                onClick={() => handleModeChange('keywords')}
                                aria-pressed={storedMode === 'keywords'}
                                className={`rounded-full px-3 py-1.5 transition ${
                                    storedMode === 'keywords'
                                        ? 'bg-gold-primary text-white dark:bg-gold-light dark:text-[#1C2B36]'
                                        : 'text-[#5A4630] hover:text-gold-primary dark:text-dark-text-secondary dark:hover:text-gold-light'
                                }`}
                            >
                                Keywords
                            </button>
                        </div>
                    </div>
                </div>

                {shouldShowInlineHeading && parsedCommentary?.inlineHeading && (
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-bold tracking-wider text-[#8FA0AD]">
                        <span>{parsedCommentary.inlineHeading}</span>
                    </div>
                )}
            </div>

            {status === 'error' ? (
                <div className="rounded-2xl border border-dashed border-gold-primary/20 bg-white/40 px-5 py-8 text-center text-sm leading-relaxed text-text-secondary dark:border-dark-border/50 dark:bg-dark-bg/40 dark:text-dark-text-secondary">
                    {errorMessage ?? 'Commentary is unavailable because the verse data could not be loaded.'}
                </div>
            ) : storedMode === 'keywords' ? (
                keywordItems.length > 0 ? (
                    <div className="space-y-4">
                        <p className="text-sm leading-relaxed text-text-secondary dark:text-dark-text-secondary">
                            This view shows only the key terms extracted from the commentary source.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {keywordItems.map(keyword => (
                                <span
                                    key={keyword}
                                    className="rounded-full border border-gold-primary/15 bg-gold-surface/60 px-3 py-1.5 text-sm font-semibold text-[#5A4630] dark:border-dark-border/70 dark:bg-dark-bg/50 dark:text-dark-text-primary"
                                >
                                    {keyword}
                                </span>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-gold-primary/20 bg-white/40 px-5 py-8 text-center text-sm leading-relaxed text-text-secondary dark:border-dark-border/50 dark:bg-dark-bg/40 dark:text-dark-text-secondary">
                        No keywords could be extracted for this verse.
                    </div>
                )
            ) : hasDisplayableCommentary && parsedCommentary ? (
                currentBlocks.length > 0 ? (
                    renderCommentaryBlocks(currentBlocks)
                ) : (
                    <div className="rounded-2xl border border-dashed border-gold-primary/20 bg-white/40 px-5 py-8 text-center text-sm leading-relaxed text-text-secondary dark:border-dark-border/50 dark:bg-dark-bg/40 dark:text-dark-text-secondary">
                        {storedMode === 'summary'
                            ? 'No summary section was found.'
                            : 'There is no text available for this mode yet.'}
                    </div>
                )
            ) : (
                <div className="rounded-2xl border border-dashed border-gold-primary/20 bg-white/40 px-5 py-8 text-center text-sm leading-relaxed text-text-secondary dark:border-dark-border/50 dark:bg-dark-bg/40 dark:text-dark-text-secondary">
                    The current source data does not include readable commentary for this verse yet.
                    <p className="mt-3 text-xs leading-6 text-text-secondary/80 dark:text-dark-text-secondary/80">
                        This panel stays available so upgraded commentary sources can appear here without changing the reading layout.
                    </p>
                </div>
            )}
        </section>
    );
};

export default VerseCommentary;
