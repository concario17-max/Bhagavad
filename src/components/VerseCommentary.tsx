import { useEffect, useState } from 'react';
import { BookOpenText } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { fetchGitaData } from '../utils/dataFetcher';
import { GitaVerse } from '../types';
import { resolveVerse } from '../utils/verse';

const VerseCommentary = () => {
    const { chapterNum, verseNum } = useParams<{ chapterNum: string; verseNum: string }>();
    const [verseData, setVerseData] = useState<GitaVerse | null>(null);

    useEffect(() => {
        if (!chapterNum || !verseNum) {
            return;
        }

        fetchGitaData()
            .then(data => {
                setVerseData(resolveVerse(data, chapterNum, verseNum));
            })
            .catch(err => console.error('Failed to load commentary data:', err));
    }, [chapterNum, verseNum]);

    const commentary = verseData?.commentary_en?.trim() ?? '';
    const hasCommentary = commentary !== '' && !commentary.startsWith('$') && !/[\u0900-\u097F]/.test(commentary);

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
                {hasCommentary ? (
                    <div className="space-y-4 rounded-2xl border border-gold-primary/15 bg-white/65 p-5 text-[14px] leading-relaxed text-text-primary shadow-inner dark:border-dark-border/50 dark:bg-dark-bg/60 dark:text-dark-text-primary">
                        {commentary.split('\n').filter(Boolean).map((paragraph, index) => (
                            <p key={`${paragraph.slice(0, 24)}-${index}`}>{paragraph}</p>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-gold-primary/20 bg-white/40 px-5 py-8 text-center text-sm leading-relaxed text-text-secondary dark:border-dark-border/50 dark:bg-dark-bg/40 dark:text-dark-text-secondary">
                        No commentary is available for this verse yet.
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerseCommentary;
