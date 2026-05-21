import { BookOpenText } from 'lucide-react';
import { useVerseData } from '../context/VerseDataContext';
import { parseCommentaryDocument } from '../utils/commentary';

const VerseCommentary = () => {
    const { chapterNum, errorMessage, hasDisplayableCommentary, status, verseData, verseRange } = useVerseData();
    const commentary = verseData?.commentary_en?.trim() ?? '';
    const parsedCommentary = hasDisplayableCommentary ? parseCommentaryDocument(commentary) : null;

    return (
        <section className="rounded-[34px] border border-gold-primary/15 bg-white/72 p-4 shadow-[0_22px_80px_-48px_rgba(78,56,22,0.52)] backdrop-blur-xl dark:border-dark-border/70 dark:bg-dark-surface/72 sm:p-6">
            <div className="mb-5 border-b border-gold-border/30 pb-3">
                <div className="flex items-center gap-2">
                    <BookOpenText className="h-5 w-5 text-[#A68B5C] dark:text-gold-light" />
                    <h2 className="text-sm font-bold tracking-wide text-[#1C2B36] dark:text-dark-text-primary">Commentary</h2>
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
            </div>

            {status === 'error' ? (
                <div className="rounded-2xl border border-dashed border-gold-primary/20 bg-white/40 px-5 py-8 text-center text-sm leading-relaxed text-text-secondary dark:border-dark-border/50 dark:bg-dark-bg/40 dark:text-dark-text-secondary">
                    {errorMessage ?? 'Commentary is unavailable because the verse data could not be loaded.'}
                </div>
            ) : hasDisplayableCommentary && parsedCommentary ? (
                <div className="space-y-4 text-[14px] leading-relaxed text-text-primary dark:text-dark-text-primary">
                    {parsedCommentary.blocks.map((block, index) => (
                        block.type === 'paragraph' ? (
                            <p key={`paragraph-${index}`}>{block.text}</p>
                        ) : block.type === 'heading' ? (
                            <h3 key={`heading-${index}`} className="pt-1 text-sm font-bold tracking-wide text-gold-primary dark:text-gold-light">
                                {block.text}
                            </h3>
                        ) : block.type === 'ordered_list' ? (
                            <ol key={`ordered-${index}`} className="space-y-2 pl-5 list-decimal">
                                {block.items.map((item, itemIndex) => (
                                    <li key={`ordered-item-${index}-${itemIndex}`}>{item}</li>
                                ))}
                            </ol>
                        ) : block.type === 'bullet_list' ? (
                            <ul key={`bullet-${index}`} className="space-y-2">
                                {block.items.map((item, itemIndex) => (
                                    <li key={`bullet-item-${index}-${itemIndex}`} className="flex gap-2">
                                        <span className="shrink-0 text-gold-primary dark:text-gold-light">·</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div key={`table-${index}`} className="overflow-x-auto rounded-xl border border-gold-primary/10">
                                <table className="min-w-full border-collapse text-left text-[13px]">
                                    <tbody>
                                        {block.rows.map((row, rowIndex) => (
                                            <tr key={`table-row-${index}-${rowIndex}`} className={rowIndex === 0 ? 'bg-gold-surface/40 dark:bg-dark-surface/60' : ''}>
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
                        )
                    ))}
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
