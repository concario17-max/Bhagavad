import { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchGitaData } from '../utils/dataFetcher';
import { withBasePath } from '../utils/paths';
import { getChapterMeta } from '../utils/chapterMeta';
import { GitaChapter } from '../types';
import { GlassCard } from '../components/ui/GlassCard';

const CompendiumModal = lazy(() => import('../components/CompendiumModal'));
const LexiconModal = lazy(() => import('../components/LexiconModal'));

const ChapterList = () => {
    const navigate = useNavigate();
    const [chapters, setChapters] = useState<GitaChapter[]>([]);
    const [isCompendiumOpen, setIsCompendiumOpen] = useState(false);
    const [isLexiconOpen, setIsLexiconOpen] = useState(false);
    const [selectedChapter, setSelectedChapter] = useState('');
    const [selectedVerse, setSelectedVerse] = useState('');

    useEffect(() => {
        fetchGitaData()
            .then(data => {
                setChapters(Object.values(data));
            })
            .catch(err => console.error('Failed to load chapters:', err));
    }, []);

    const selectedChapterData = selectedChapter
        ? chapters.find(chapter => chapter.chapter === Number.parseInt(selectedChapter, 10))
        : undefined;

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

                <div className="bg-white dark:bg-dark-surface backdrop-blur-sm border border-gold-primary/30 rounded-2xl shadow-xl shadow-gold-primary/10 dark:shadow-[0_8px_30px_-5px_rgba(0,0,0,0.5)] p-5 sm:p-6 mb-16 relative z-10 w-full max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
                    <div className="flex-1 w-full flex flex-col items-start px-2 sm:px-6 border-b sm:border-b-0 sm:border-r border-gold-border/40 pb-4 sm:pb-0">
                        <span className="text-[11px] font-black text-gold-primary tracking-[0.25em] uppercase mb-2 drop-shadow-sm">Chapter</span>
                        <select
                            className="text-base sm:text-lg font-crimson font-medium text-text-primary bg-transparent outline-none w-full cursor-pointer appearance-none dark:text-dark-text-primary transition-colors focus:text-gold-primary"
                            value={selectedChapter}
                            onChange={event => {
                                const chapterValue = event.target.value;
                                setSelectedChapter(chapterValue);
                                setSelectedVerse('');
                            }}
                        >
                            <option value="">Select a chapter</option>
                            {chapters.map(chapter => (
                                <option key={chapter.chapter} value={chapter.chapter} className="text-base">
                                    Chapter {chapter.chapter}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex-1 w-full flex flex-col items-start px-2 sm:px-8 pt-2 sm:pt-0">
                        <span className="text-[11px] font-black text-gold-primary tracking-[0.25em] uppercase mb-2 drop-shadow-sm">Verse</span>
                        <select
                            className="text-base sm:text-lg font-crimson font-medium text-text-primary bg-transparent outline-none w-full cursor-pointer appearance-none dark:text-dark-text-primary transition-colors focus:text-gold-primary disabled:opacity-50"
                            value={selectedVerse}
                            disabled={!selectedChapter}
                            onChange={event => {
                                const verseValue = event.target.value;
                                setSelectedVerse(verseValue);

                                if (selectedChapter && verseValue) {
                                    navigate(`/chapter/${selectedChapter}/verse/${verseValue}`);
                                }
                            }}
                        >
                            <option value="">{selectedChapter ? 'Select a verse' : 'Select chapter first'}</option>
                            {selectedChapterData?.verses.map(verse => (
                                <option key={verse.verse} value={verse.verse} className="text-base">
                                    Verse {verse.verse}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

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
