import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CHAPTER_DATA } from '../constants';
import CompendiumModal from '../components/CompendiumModal';
import LexiconModal from '../components/LexiconModal';
import ReflectionsModal from '../components/ReflectionsModal';

const ChapterList = () => {
    const navigate = useNavigate();
    const [chapters, setChapters] = useState([]);
    const [isCompendiumOpen, setIsCompendiumOpen] = useState(false);
    const [isLexiconOpen, setIsLexiconOpen] = useState(false);
    const [isReflectionsOpen, setIsReflectionsOpen] = useState(false);

    const [selectedChapter, setSelectedChapter] = useState('');
    const [selectedVerse, setSelectedVerse] = useState('');

    useEffect(() => {
        fetch('/gita.json')
            .then(res => res.json())
            .then(data => {
                if (data && typeof data === 'object') {
                    const chapterArray = Object.values(data);
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
                {/* Book Icon centered like Yoga Sutras */}
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

                {/* Subtitle Divider with Flower/Lotus */}
                <div className="flex items-center justify-center w-full max-w-md mx-auto mb-16 opacity-60">
                    <div className="flex-1 h-px bg-gold-border"></div>
                    <div className="mx-4 text-gold-primary text-xl font-serif leading-none">❦</div>
                    <div className="flex-1 h-px bg-gold-border"></div>
                </div>

                {/* Functional Selector box */}
                <div className="bg-white dark:bg-dark-surface backdrop-blur-sm border border-gold-primary/30 rounded-2xl shadow-xl shadow-gold-primary/10 dark:shadow-[0_8px_30px_-5px_rgba(0,0,0,0.5)] p-5 sm:p-6 mb-16 relative z-10 w-full max-w-3xl mx-auto flex items-center justify-between">
                    <div className="flex-1 flex flex-col items-start px-2 sm:px-6 border-r border-gold-border/40">
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

                    <div className="flex-1 flex flex-col items-start px-4 sm:px-8">
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
                        <Link
                            key={ch.chapter}
                            to={`/chapter/${ch.chapter}/verse/1`}
                            className="group relative flex flex-col items-center justify-start text-center p-8 pt-12 sm:pt-16 bg-white/50 dark:bg-[#161616]/70 backdrop-blur-md border border-gold-border/50 hover:border-gold-primary/70 rounded-2xl shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-gold-primary/20 dark:shadow-none dark:hover:shadow-[0_8px_30px_-5px_rgba(0,0,0,0.6)] transition-all duration-700 min-h-[340px] overflow-hidden"
                        >
                            {/* Inner Hover Gradient Spotlight */}
                            <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-transparent dark:from-white/[0.03] dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0 pointer-events-none"></div>

                            {/* Icon Placeholder (Sun/Lotus/Mind) */}
                            <div className="w-8 h-8 flex items-center justify-center text-gold-primary/60 mb-6 group-hover:scale-110 transition-transform relative z-10">
                                <span className="text-2xl font-serif leading-none opacity-90">֍</span>
                            </div>

                            <div className="relative z-10 w-full mb-auto flex flex-col items-center">
                                <span className="block mb-3 text-[11px] font-black tracking-[0.35em] uppercase text-gold-primary/90 dark:text-gold-light/90 drop-shadow-sm">
                                    CHAPTER {ch.chapter}
                                </span>
                                <h2 className="font-bold tracking-wide mb-5 text-text-primary dark:text-dark-text-primary font-noto-kr flex flex-col gap-1.5 mt-1">
                                    {(() => {
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
                                    })()}
                                </h2>
                                <div className="w-8 h-[1px] bg-gold-border/80 mx-auto my-3 group-hover:w-16 transition-all duration-500"></div>
                                <p className="text-[12px] text-text-secondary dark:text-dark-text-secondary font-crimson italic max-w-[200px] mx-auto opacity-90">
                                    {chapterInfo?.description || "Read verses of this chapter."}
                                </p>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Compendium Modal */}
            <CompendiumModal
                isOpen={isCompendiumOpen}
                onClose={() => setIsCompendiumOpen(false)}
            />

            {/* Lexicon Modal */}
            <LexiconModal
                isOpen={isLexiconOpen}
                onClose={() => setIsLexiconOpen(false)}
            />

            {/* Reflections Modal */}
            <ReflectionsModal
                isOpen={isReflectionsOpen}
                onClose={() => setIsReflectionsOpen(false)}
            />
        </div>
    );
};

export default ChapterList;
