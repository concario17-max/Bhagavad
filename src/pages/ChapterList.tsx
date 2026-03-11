import { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { CHAPTER_DATA } from '../constants';
import { fetchGitaData } from '../utils/dataFetcher';
import { GitaChapter } from '../types';
import { GlassCard } from '../components/ui/GlassCard';

const CompendiumModal = lazy(() => import('../components/CompendiumModal'));
const LexiconModal = lazy(() => import('../components/LexiconModal'));
const ReflectionsModal = lazy(() => import('../components/ReflectionsModal'));

const ChapterList = () => {
    const navigate = useNavigate();
    const [chapters, setChapters] = useState<GitaChapter[]>([]);
    const [isCompendiumOpen, setIsCompendiumOpen] = useState<boolean>(false);
    const [isLexiconOpen, setIsLexiconOpen] = useState<boolean>(false);
    const [isReflectionsOpen, setIsReflectionsOpen] = useState<boolean>(false);

    const [selectedChapter, setSelectedChapter] = useState<string>('');
    const [selectedVerse, setSelectedVerse] = useState<string>('');

    useEffect(() => {
        fetchGitaData()
            .then(data => {
                if (data && typeof data === 'object') {
                    const chapterArray = Object.values(data) as GitaChapter[];
                    setChapters(chapterArray);
                } else {
                    console.error('Invalid gita.json format');
                }
            })
            .catch(err => console.error('Failed to load chapters:', err));
    }, []);

    return (
        <div className="container mx-auto max-w-5xl px-4 py-8 md:py-12 transition-colors duration-500">
            <div className="text-center mb-10 md:mb-16 flex flex-col items-center">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gold-surface/50 dark:bg-dark-surface border border-gold-border dark:border-dark-border mb-6">
                    <img src="/gita_header_icon.png" alt="Icon" className="w-6 h-6 object-contain opacity-80" />
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-[56px] tracking-[0.2em] font-crimson text-text-primary dark:text-dark-text-primary mb-5 drop-shadow-sm font-light">
                    BHAGAVAD GITA
                </h1>
                <p className="text-sm sm:text-base text-gold-primary dark:text-gold-light italic font-crimson tracking-wide mb-8">
                    The Song of God
                </p>

                <div className="flex items-center gap-4 sm:gap-8 text-xs sm:text-sm font-crimson tracking-widest text-text-secondary uppercase mb-12">
                    <span
                        onClick={() => setIsCompendiumOpen(true)}
                        className="hover:text-gold-primary cursor-pointer transition-colors italic"
                    >
                        Compendium
                    </span>
                    <div className="w-1.5 h-1.5 rotate-45 bg-gold-border/50"></div>
                    <span
                        onClick={() => setIsLexiconOpen(true)}
                        className="hover:text-gold-primary cursor-pointer transition-colors italic"
                    >
                        Lexicon
                    </span>
                    <div className="w-1.5 h-1.5 rotate-45 bg-gold-border/50"></div>
                    <span
                        onClick={() => setIsReflectionsOpen(true)}
                        className="hover:text-gold-primary cursor-pointer transition-colors italic"
                    >
                        Commentaries
                    </span>
                </div>

                <div className="flex items-center justify-center w-full max-w-md mx-auto mb-16 opacity-60">
                    <div className="flex-1 h-px bg-gold-border"></div>
                    <div className="mx-4 text-gold-primary text-xl font-serif leading-none">❦</div>
                    <div className="flex-1 h-px bg-gold-border"></div>
                </div>

                <div className="bg-white dark:bg-dark-surface backdrop-blur-sm border border-gold-primary/30 rounded-2xl shadow-xl shadow-gold-primary/10 dark:shadow-[0_8px_30px_-5px_rgba(0,0,0,0.5)] p-5 sm:p-6 mb-16 relative z-10 w-full max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
                    <div className="flex-1 w-full flex flex-col items-start px-2 sm:px-6 border-b sm:border-b-0 sm:border-r border-gold-border/40 pb-4 sm:pb-0">
                        <span className="text-[11px] font-black text-gold-primary tracking-[0.25em] uppercase mb-2 drop-shadow-sm">CHAPTER</span>
                        <select
                            className="text-base sm:text-lg font-crimson font-medium text-text-primary bg-transparent outline-none w-full cursor-pointer appearance-none dark:text-dark-text-primary transition-colors focus:text-gold-primary"
                            value={selectedChapter}
                            onChange={(e) => {
                                const ch = e.target.value;
                                setSelectedChapter(ch);
                                setSelectedVerse(''); // Reset verse when chapter changes
                            }}
                        >
                            <option value="">Select a Chapter</option>
                            {chapters.map(ch => (
                                <option key={ch.chapter} value={ch.chapter} className="text-base">Chapter {ch.chapter}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex-1 w-full flex flex-col items-start px-2 sm:px-8 pt-2 sm:pt-0">
                        <span className="text-[11px] font-black text-gold-primary tracking-[0.25em] uppercase mb-2 drop-shadow-sm">VERSE</span>
                        <select
                            className="text-base sm:text-lg font-crimson font-medium text-text-primary bg-transparent outline-none w-full cursor-pointer appearance-none dark:text-dark-text-primary transition-colors focus:text-gold-primary disabled:opacity-50"
                            value={selectedVerse}
                            disabled={!selectedChapter}
                            onChange={(e) => {
                                const v = e.target.value;
                                setSelectedVerse(v);
                                if (selectedChapter && v) {
                                    navigate(`/chapter/${selectedChapter}/verse/${v}`);
                                }
                            }}
                        >
                            <option value="">{selectedChapter ? "Select a Verse" : "Select Chapter First"}</option>
                            {selectedChapter && chapters.find(c => c.chapter === parseInt(selectedChapter))?.verses.map(v => (
                                <option key={v.verse} value={v.verse} className="text-base">Verse {v.verse}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto px-4 relative z-10 pb-20">
                {chapters.map((ch) => {
                    const chapterInfo = CHAPTER_DATA[ch.chapter];
                    return (
                        <GlassCard
                            key={ch.chapter}
                            href={`/chapter/${ch.chapter}/verse/1`}
                            icon={<span className="text-2xl font-serif leading-none opacity-90">֍</span>}
                            subtitle={`CHAPTER ${ch.chapter}`}
                            title={
                                (() => {
                                    const title = chapterInfo?.name_korean || chapterInfo?.name || ch.name_translated || "";
                                    const match = title.match(/^(.*?)\s*\((.*?)\)$/);
                                    if (match) {
                                        return (
                                            <>
                                                <span className="text-lg sm:text-xl md:text-2xl">{match[1].trim()}</span>
                                                <span className="text-sm sm:text-base text-text-secondary dark:text-dark-text-secondary font-medium mt-1">
                                                    ({match[2].trim()})
                                                </span>
                                            </>
                                        );
                                    }
                                    return <span className="text-lg sm:text-xl md:text-2xl">{title}</span>;
                                })()
                            }
                            description={chapterInfo?.description || "Read verses of this chapter."}
                        />
                    );
                })}
            </div>

            <Suspense fallback={null}>
                {isCompendiumOpen && (
                    <CompendiumModal
                        isOpen={isCompendiumOpen}
                        onClose={() => setIsCompendiumOpen(false)}
                    />
                )}
                {isLexiconOpen && (
                    <LexiconModal
                        isOpen={isLexiconOpen}
                        onClose={() => setIsLexiconOpen(false)}
                    />
                )}
                {isReflectionsOpen && (
                    <ReflectionsModal
                        isOpen={isReflectionsOpen}
                        onClose={() => setIsReflectionsOpen(false)}
                    />
                )}
            </Suspense>
        </div>
    );
};

export default ChapterList;
