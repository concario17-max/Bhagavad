import { BookImage, BookOpenText } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { useVerseData } from '../context/VerseDataContext';
import { parseCommentaryDocument } from '../utils/commentary';

type ComicMode = 'comic' | 'commentary';

type ComicImageModule = {
    default: string;
};

const comicImageModules = import.meta.glob<ComicImageModule>('../../comics/*/*.png', {
    eager: true
}) as Record<string, ComicImageModule>;

const comicImageByKey: Record<string, string> = Object.entries(comicImageModules).reduce<Record<string, string>>((accumulator, [path, module]) => {
    const normalizedPath = path.replace(/\\/g, '/');
    const match = normalizedPath.match(/comics\/(\d+)\/(.+)\.png$/);

    if (!match) {
        return accumulator;
    }

    const chapterNumber = Number.parseInt(match[1], 10);
    const verseKey = `${chapterNumber}:${match[2]}`;
    accumulator[verseKey] = module.default;
    return accumulator;
}, {});

const STORAGE_PREFIX = 'gita:verse-commentary-mode';

const getStorageKey = (chapterNum: string, verseRange: string) => `${STORAGE_PREFIX}:${chapterNum}:${verseRange}`;

const VerseCommentary = () => {
    const { chapterNum, errorMessage, hasDisplayableCommentary, status, verseData, verseRange } = useVerseData();
    const commentary = verseData?.commentary_en?.trim() ?? '';
    const parsedCommentary = hasDisplayableCommentary ? parseCommentaryDocument(commentary) : null;

    const verseKey = useMemo(() => {
        if (!chapterNum || !verseRange) {
            return null;
        }

        return `${chapterNum}:${verseRange}`;
    }, [chapterNum, verseRange]);

    const comicImageSrc = verseKey ? comicImageByKey[verseKey] ?? null : null;
    const hasComicImage = comicImageSrc !== null;
    const defaultMode: ComicMode = hasComicImage ? 'comic' : 'commentary';
    const [storedMode, setStoredMode] = useState<ComicMode | null>(null);

    useEffect(() => {
        if (!verseKey || typeof window === 'undefined') {
            setStoredMode(null);
            return;
        }

        const savedMode = window.localStorage.getItem(getStorageKey(chapterNum, verseRange));
        if (savedMode === 'comic' || savedMode === 'commentary') {
            setStoredMode(savedMode);
            return;
        }

        setStoredMode(null);
    }, [chapterNum, verseKey, verseRange]);

    useEffect(() => {
        if (!verseKey || typeof window === 'undefined' || storedMode === null) {
            return;
        }

        window.localStorage.setItem(getStorageKey(chapterNum, verseRange), storedMode);
    }, [chapterNum, storedMode, verseKey, verseRange]);

    const effectiveMode: ComicMode = hasComicImage ? (storedMode ?? defaultMode) : 'commentary';
    const shouldShowComic = effectiveMode === 'comic' && hasComicImage && comicImageSrc !== null;

    const handleToggleMode = () => {
        if (!verseKey || !hasComicImage || typeof window === 'undefined') {
            return;
        }

        const nextMode: ComicMode = effectiveMode === 'comic' ? 'commentary' : 'comic';
        setStoredMode(nextMode);
        window.localStorage.setItem(getStorageKey(chapterNum, verseRange), nextMode);
    };

    const toggleLabel = effectiveMode === 'comic' ? 'Comic' : 'Commentary';
    const toggleTitle = hasComicImage
        ? effectiveMode === 'comic'
            ? 'Switch to commentary'
            : 'Switch to comic'
        : 'Comic unavailable for this verse';
    const isHiddenInlineHeadingVerse = chapterNum === '1' && (verseRange === '1' || verseRange === '15');
    const shouldShowInlineHeading = !isHiddenInlineHeadingVerse && parsedCommentary?.inlineHeading !== null;

    return (
        <section className="rounded-[32px] border border-gold-primary/14 bg-white/72 p-4 shadow-[0_22px_80px_-48px_rgba(78,56,22,0.52)] backdrop-blur-xl dark:border-dark-border/70 dark:bg-dark-surface/72 sm:p-5 lg:p-6">
            <div className="mb-5 flex items-start justify-between gap-3 border-b border-gold-border/30 pb-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <BookOpenText className="h-5 w-5 text-[#A68B5C] dark:text-gold-light" />
                        <h2 className="text-sm font-bold tracking-[0.18em] text-[#1C2B36] uppercase dark:text-dark-text-primary">
                            Commentary
                        </h2>
                    </div>
                    {chapterNum && verseRange && (
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-bold tracking-wider text-[#8FA0AD]">
                            <span>
                                {chapterNum}.{verseRange}
                            </span>
                            {shouldShowInlineHeading && parsedCommentary?.inlineHeading && (
                                <span className="text-[11px] font-semibold tracking-normal text-text-secondary dark:text-dark-text-secondary">
                                    {parsedCommentary.inlineHeading}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                <button
                    type="button"
                    onClick={handleToggleMode}
                    disabled={!hasComicImage}
                    aria-pressed={effectiveMode === 'comic'}
                    title={toggleTitle}
                    className="inline-flex items-center gap-2 rounded-full border border-gold-border/60 bg-white/82 px-3 py-1.5 text-xs font-semibold tracking-wide text-[#5A4630] transition hover:border-gold-primary/40 hover:text-gold-primary disabled:cursor-not-allowed disabled:opacity-40 dark:border-dark-border/70 dark:bg-dark-bg/50 dark:text-dark-text-secondary dark:hover:text-gold-light"
                >
                    {effectiveMode === 'comic' ? (
                        <BookImage className="h-4 w-4" aria-hidden="true" />
                    ) : (
                        <BookOpenText className="h-4 w-4" aria-hidden="true" />
                    )}
                    <span>{toggleLabel}</span>
                </button>
            </div>

            {status === 'error' ? (
                <div className="rounded-[24px] border border-dashed border-gold-primary/20 bg-white/42 px-5 py-8 text-center text-sm leading-relaxed text-text-secondary dark:border-dark-border/50 dark:bg-dark-bg/40 dark:text-dark-text-secondary">
                    {errorMessage ?? 'Commentary is unavailable because the verse data could not be loaded.'}
                </div>
            ) : shouldShowComic && comicImageSrc ? (
                <div className="overflow-hidden rounded-[24px] border border-gold-primary/10 bg-white/70 dark:border-dark-border/50 dark:bg-dark-bg/30">
                    <img
                        src={comicImageSrc}
                        alt={`${chapterNum}.${verseRange} comic page`}
                        className="h-auto w-full object-contain"
                        loading="lazy"
                    />
                </div>
            ) : hasDisplayableCommentary && parsedCommentary ? (
                <div className="space-y-4 text-[14px] leading-relaxed text-text-primary dark:text-dark-text-primary">
                    {parsedCommentary.blocks.map((block, index) =>
                        block.type === 'paragraph' ? (
                            <p key={`paragraph-${index}`}>{block.text}</p>
                        ) : block.type === 'heading' ? (
                            <h3 key={`heading-${index}`} className="pt-1 text-sm font-bold tracking-wide text-gold-primary dark:text-gold-light">
                                {block.text}
                            </h3>
                        ) : block.type === 'ordered_list' ? (
                            <ol key={`ordered-${index}`} className="list-decimal space-y-2 pl-5">
                                {block.items.map((item, itemIndex) => (
                                    <li key={`ordered-item-${index}-${itemIndex}`}>{item}</li>
                                ))}
                            </ol>
                        ) : block.type === 'bullet_list' ? (
                            <ul key={`bullet-${index}`} className="space-y-2">
                                {block.items.map((item, itemIndex) => (
                                    <li key={`bullet-item-${index}-${itemIndex}`} className="flex gap-2">
                                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-primary dark:bg-gold-light" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div key={`table-${index}`} className="overflow-x-auto rounded-[20px] border border-gold-primary/10">
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
                        )
                    )}
                </div>
            ) : (
                <div className="rounded-[24px] border border-dashed border-gold-primary/20 bg-white/42 px-5 py-8 text-center text-sm leading-relaxed text-text-secondary dark:border-dark-border/50 dark:bg-dark-bg/40 dark:text-dark-text-secondary">
                    <p className="text-base font-semibold tracking-wide text-text-primary dark:text-dark-text-primary">
                        No readable commentary yet
                    </p>
                    <p className="mt-3">
                        The reading layout stays in place, and this panel is ready for a displayable commentary source or the comic page for this verse.
                    </p>
                </div>
            )}
        </section>
    );
};

export default VerseCommentary;
