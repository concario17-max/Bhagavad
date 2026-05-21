import { useEffect, useMemo, useState } from 'react';
import { BookImage, BookOpenText } from 'lucide-react';
import { useVerseData } from '../context/VerseDataContext';
import { parseCommentaryDocument } from '../utils/commentary';

type ComicImageModule = {
    default: string;
};

const comicImageModules = import.meta.glob<ComicImageModule>('../../학습만화/*/*.png', {
    eager: true
}) as Record<string, ComicImageModule>;

const comicImageByKey = Object.entries(comicImageModules).reduce<Record<string, string>>((accumulator, [path, module]) => {
    const normalizedPath = path.replace(/\\/g, '/');
    const parts = normalizedPath.split('/');
    const chapterFolder = parts[parts.length - 2];
    const fileName = parts[parts.length - 1];

    if (!chapterFolder || !fileName) {
        return accumulator;
    }

    const verseKey = fileName.replace(/\.png$/i, '');
    if (verseKey !== '') {
        accumulator[`${chapterFolder}:${verseKey}`] = module.default;
    }

    return accumulator;
}, {});

const resolveComicImage = (
    chapterNum: string | number | null | undefined,
    verseRange: string | null | undefined
): string | null => {
    if (chapterNum === null || chapterNum === undefined || !verseRange) {
        return null;
    }

    const normalizedChapter = Number.parseInt(String(chapterNum), 10);
    if (Number.isNaN(normalizedChapter)) {
        return null;
    }

    return comicImageByKey[`${normalizedChapter}:${verseRange}`] ?? null;
};

const VerseCommentary = () => {
    const { chapterNum, errorMessage, hasDisplayableCommentary, status, verseData, verseRange } = useVerseData();
    const commentary = verseData?.commentary_en?.trim() ?? '';
    const parsedCommentary = hasDisplayableCommentary ? parseCommentaryDocument(commentary) : null;
    const comicImageKey = useMemo(() => {
        if (chapterNum === null || chapterNum === undefined || !verseRange) {
            return null;
        }

        const normalizedChapter = Number.parseInt(String(chapterNum), 10);
        if (Number.isNaN(normalizedChapter)) {
            return null;
        }

        return `${normalizedChapter}:${verseRange}`;
    }, [chapterNum, verseRange]);
    const comicImageSrc = useMemo(() => resolveComicImage(chapterNum, verseRange), [chapterNum, verseRange]);
    const comicImageCount = Object.keys(comicImageByKey).length;
    const [showComicMode, setShowComicMode] = useState(false);

    useEffect(() => {
        if (!comicImageSrc && showComicMode) {
            setShowComicMode(false);
        }
    }, [comicImageSrc, showComicMode]);

    return (
        <section className="rounded-[34px] border border-gold-primary/15 bg-white/72 p-4 shadow-[0_22px_80px_-48px_rgba(78,56,22,0.52)] backdrop-blur-xl dark:border-dark-border/70 dark:bg-dark-surface/72 sm:p-6">
            <div className="mb-5 border-b border-gold-border/30 pb-3">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <BookOpenText className="h-5 w-5 text-[#A68B5C] dark:text-gold-light" />
                        <h2 className="text-sm font-bold tracking-wide text-[#1C2B36] dark:text-dark-text-primary">Commentary</h2>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            if (comicImageSrc) {
                                setShowComicMode(previous => !previous);
                            }
                        }}
                        disabled={!comicImageSrc}
                        aria-pressed={comicImageSrc ? showComicMode : undefined}
                        aria-label={comicImageSrc ? (showComicMode ? 'Show commentary' : 'Show comic mode') : 'Comic mode unavailable'}
                        title={comicImageSrc ? (showComicMode ? 'Show commentary' : 'Show comic mode') : 'Comic mode unavailable for this verse'}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gold-primary/15 bg-white/70 text-gold-muted transition-colors hover:border-gold-primary/40 hover:text-gold-primary disabled:cursor-not-allowed disabled:opacity-30 dark:border-dark-border/70 dark:bg-dark-surface/70 dark:text-gold-light dark:hover:border-gold-light/40"
                    >
                        <BookImage className="h-4.5 w-4.5" />
                    </button>
                </div>

                {chapterNum && verseRange && (
                    <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-bold tracking-wider text-[#8FA0AD]">
                        <span>{chapterNum}.{verseRange}</span>
                        {parsedCommentary?.inlineHeading && (
                            <span className="text-[11px] font-semibold tracking-normal text-text-secondary dark:text-dark-text-secondary">
                                {parsedCommentary.inlineHeading}
                            </span>
                        )}
                    </div>
                )}

                {import.meta.env.DEV && (
                    <div className="mt-3 rounded-2xl border border-gold-primary/10 bg-white/45 px-3 py-2 text-[11px] leading-5 text-text-secondary dark:border-dark-border/50 dark:bg-dark-bg/35 dark:text-dark-text-secondary">
                        <div>
                            comic files: <span className="font-semibold text-text-primary dark:text-dark-text-primary">{comicImageCount}</span>
                        </div>
                        <div>
                            comic key: <span className="font-semibold text-text-primary dark:text-dark-text-primary">{comicImageKey ?? 'missing'}</span>
                        </div>
                        <div>
                            comic match: <span className="font-semibold text-text-primary dark:text-dark-text-primary">{comicImageSrc ? 'found' : 'missing'}</span>
                        </div>
                        <div>
                            button: <span className="font-semibold text-text-primary dark:text-dark-text-primary">{comicImageSrc ? (showComicMode ? 'comic' : 'commentary') : 'disabled'}</span>
                        </div>
                    </div>
                )}
            </div>

            {showComicMode && comicImageSrc ? (
                <div className="space-y-4">
                    <div className="overflow-hidden rounded-[28px] border border-gold-primary/10 bg-white/50 shadow-sm dark:border-dark-border/50 dark:bg-dark-bg/40">
                        <img
                            src={comicImageSrc}
                            alt={`${chapterNum}.${verseRange} 학습만화`}
                            className="block h-auto w-full select-none object-contain"
                            loading="lazy"
                        />
                    </div>
                </div>
            ) : status === 'error' ? (
                <div className="rounded-2xl border border-dashed border-gold-primary/20 bg-white/40 px-5 py-8 text-center text-sm leading-relaxed text-text-secondary dark:border-dark-border/50 dark:bg-dark-bg/40 dark:text-dark-text-secondary">
                    {errorMessage ?? 'Commentary is unavailable because the verse data could not be loaded.'}
                </div>
            ) : hasDisplayableCommentary && parsedCommentary ? (
                <div className="space-y-4 text-[14px] leading-relaxed text-text-primary dark:text-dark-text-primary">
                    {parsedCommentary.blocks.map((block, index) => {
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
                                            <span className="shrink-0 text-gold-primary dark:text-gold-light">·</span>
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
                                            <tr
                                                key={`table-row-${index}-${rowIndex}`}
                                                className={rowIndex === 0 ? 'bg-gold-surface/40 dark:bg-dark-surface/60' : ''}
                                            >
                                                {row.map((cell, cellIndex) => (
                                                    <td
                                                        key={`table-cell-${index}-${rowIndex}-${cellIndex}`}
                                                        className="border border-gold-primary/10 px-3 py-2 align-top"
                                                    >
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
