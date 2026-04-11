import { useState, useEffect, lazy, Suspense } from 'react';
import { fetchGitaData } from '../utils/dataFetcher';
import { withBasePath } from '../utils/paths';
import { getChapterMeta } from '../utils/chapterMeta';
import { GitaChapter } from '../types';
import { GlassCard } from '../components/ui/GlassCard';

const CompendiumModal = lazy(() => import('../components/CompendiumModal'));
const LexiconModal = lazy(() => import('../components/LexiconModal'));

const ChapterList = () => {
    const [chapters, setChapters] = useState<GitaChapter[]>([]);
    const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading');
    const [isCompendiumOpen, setIsCompendiumOpen] = useState(false);
    const [isLexiconOpen, setIsLexiconOpen] = useState(false);

    useEffect(() => {
        fetchGitaData()
            .then(data => {
                setChapters(Object.values(data));
                setLoadState('ready');
            })
            .catch(() => {
                setLoadState('error');
            });
    }, []);

    return (
        <div className="container mx-auto max-w-5xl px-4 py-8 md:py-12 transition-colors duration-500">
            <div className="text-center mb-10 md:mb-16 flex flex-col items-center">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gold-surface/50 dark:bg-dark-surface border border-gold-border dark:border-dark-border mb-6">
                    <img src={withBasePath('gita_header_icon.png')} alt="Bhagavad Gita icon" className="w-6 h-6 object-contain opacity-80" />
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-[56px] tracking-[0.2em] font-crimson text-text-primary dark:text-dark-text-primary mb-5 drop-shadow-sm font-light">
                    BHAGAVAD GITA
                </h1>
                <p className="text-sm sm:text-base text-gold-primary dark:text-gold-light italic font-crimson tracking-wide mb-8">
                    The Song of God
                </p>

                <div className="flex items-center gap-4 sm:gap-8 text-xs sm:text-sm font-crimson tracking-widest text-text-secondary uppercase mb-12">
                    <button type="button" onClick={() => setIsCompendiumOpen(true)} className="hover:text-gold-primary transition-colors italic">
                        Compendium
                    </button>
                    <div className="w-1.5 h-1.5 rotate-45 bg-gold-border/50"></div>
                    <button type="button" onClick={() => setIsLexiconOpen(true)} className="hover:text-gold-primary transition-colors italic">
                        Lexicon
                    </button>
                </div>

                <div className="flex items-center justify-center w-full max-w-md mx-auto mb-16 opacity-60">
                    <div className="flex-1 h-px bg-gold-border"></div>
                    <div className="mx-4 text-gold-primary text-xl font-serif leading-none">✦</div>
                    <div className="flex-1 h-px bg-gold-border"></div>
                </div>
            </div>

            {loadState === 'error' && (
                <div className="mx-auto mb-10 max-w-3xl rounded-2xl border border-dashed border-gold-primary/20 bg-white/55 px-6 py-5 text-center text-sm leading-relaxed text-text-secondary dark:border-dark-border/50 dark:bg-dark-surface/45 dark:text-dark-text-secondary">
                    Chapter data could not be loaded from the local source files. Please refresh and try again.
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto px-4 relative z-10 pb-20">
                {chapters.map(chapter => {
                    const chapterMeta = getChapterMeta(chapter);

                    return (
                        <GlassCard
                            key={chapter.chapter}
                            href={`/chapter/${chapter.chapter}/verse/1`}
                            icon={<span className="text-2xl font-serif leading-none opacity-90">ॐ</span>}
                            subtitle={`CHAPTER ${chapter.chapter}`}
                            title={
                                chapterMeta.subtitle ? (
                                    <>
                                        <span className="text-lg sm:text-xl md:text-2xl">{chapterMeta.mainTitle}</span>
                                        <span className="text-sm sm:text-base text-text-secondary dark:text-dark-text-secondary font-medium mt-1">
                                            {chapterMeta.subtitle}
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-lg sm:text-xl md:text-2xl">{chapterMeta.displayTitle}</span>
                                )
                            }
                            description={chapterMeta.description}
                        />
                    );
                })}
            </div>

            <Suspense fallback={null}>
                {isCompendiumOpen && <CompendiumModal isOpen={isCompendiumOpen} onClose={() => setIsCompendiumOpen(false)} />}
                {isLexiconOpen && <LexiconModal isOpen={isLexiconOpen} onClose={() => setIsLexiconOpen(false)} />}
            </Suspense>
        </div>
    );
};

export default ChapterList;
