import { BookOpenText } from 'lucide-react';
import { useVerseData } from '../context/VerseDataContext';

const VerseCommentary = () => {
    const { chapterNum, verseNum, errorMessage, hasDisplayableCommentary, status, verseData } = useVerseData();
    const commentary = verseData?.commentary_en?.trim() ?? '';

    return (
        <div className="flex h-full min-h-0 flex-col">
            <div className="mb-6 shrink-0 border-b border-gold-border/30 pb-4">
                <div className="flex items-center gap-2">
                    <BookOpenText className="h-5 w-5 text-[#A68B5C] dark:text-gold-light" />
                    <h2 className="text-sm font-bold tracking-wide text-[#1C2B36] dark:text-dark-text-primary">Commentary</h2>
                </div>
                {chapterNum && verseNum && (
                    <p className="mt-3 text-xs font-bold tracking-wider text-[#8FA0AD]">
                        {chapterNum}.{verseNum}
                    </p>
                )}
            </div>

            <div className="custom-scrollbar flex-1 overflow-y-auto pr-1">
                {status === 'error' ? (
                    <div className="rounded-2xl border border-dashed border-gold-primary/20 bg-white/40 px-5 py-8 text-center text-sm leading-relaxed text-text-secondary dark:border-dark-border/50 dark:bg-dark-bg/40 dark:text-dark-text-secondary">
                        {errorMessage ?? 'Commentary is unavailable because the verse data could not be loaded.'}
                    </div>
                ) : hasDisplayableCommentary ? (
                    <div className="space-y-4 rounded-2xl border border-gold-primary/15 bg-white/65 p-5 text-[14px] leading-relaxed text-text-primary shadow-inner dark:border-dark-border/50 dark:bg-dark-bg/60 dark:text-dark-text-primary">
                        {commentary.split('\n').filter(Boolean).map((paragraph, index) => (
                            <p key={`${paragraph.slice(0, 24)}-${index}`}>{paragraph}</p>
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
            </div>
        </div>
    );
};

export default VerseCommentary;
