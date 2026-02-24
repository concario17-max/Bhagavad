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
                <h1 className="text-3xl sm:text-4xl md:text-[44px] tracking-[0.15em] font-crimson text-text-primary dark:text-dark-text-primary mb-3">
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
                <div className="bg-white/80 dark:bg-dark-surface/80 backdrop-blur-sm border border-gold-border/60 rounded-xl shadow-[0_4px_25px_-5px_rgba(184,134,11,0.06)] dark:shadow-[0_4px_25px_-5px_rgba(0,0,0,0.3)] p-4 w-full max-w-2xl mx-auto flex items-center justify-between mb-16 relative z-10">
                    <div className="flex-1 flex flex-col items-start px-4 border-r border-gold-border/30">
                        <span className="text-[10px] font-bold text-gold-primary/60 tracking-[0.2em] uppercase mb-1">CHAPTER</span>
                        <select
                            className="text-sm font-crimson font-medium text-text-primary bg-transparent outline-none w-full cursor-pointer appearance-none dark:text-dark-text-primary"
                            value={selectedChapter}
                            onChange={(e) => {
                                const ch = e.target.value;
                                setSelectedChapter(ch);
                                setSelectedVerse(''); // Reset verse when chapter changes
                            }}
                        >
                            <option value="">Select a Chapter</option>
                            {chapters.map(ch => (
                                <option key={ch.chapter} value={ch.chapter}>Chapter {ch.chapter}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex-1 flex flex-col items-start px-4">
                        <span className="text-[10px] font-bold text-gold-primary/60 tracking-[0.2em] uppercase mb-1">VERSE</span>
                        <select
                            className="text-sm font-crimson font-medium text-text-primary bg-transparent outline-none w-full cursor-pointer appearance-none dark:text-dark-text-primary"
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
                                <option key={v.verse} value={v.verse}>Verse {v.verse}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-gold-border/30 dark:bg-dark-border max-w-6xl mx-auto rounded-none overflow-hidden border border-gold-border/40">
                {chapters.map((ch) => {
                    const chapterInfo = CHAPTER_DATA[ch.chapter];
                    return (
                        <Link
                            key={ch.chapter}
                            to={`/chapter/${ch.chapter}/verse/1`}
                            className="group relative flex flex-col items-center justify-start text-center p-8 pt-12 sm:pt-16 bg-white/40 dark:bg-dark-bg/40 backdrop-blur-sm hover:bg-gold-surface/40 dark:hover:bg-dark-surface transition-all duration-500 min-h-[320px]"
                        >
                            {/* Icon Placeholder (Sun/Lotus/Mind) */}
                            <div className="w-8 h-8 flex items-center justify-center text-gold-primary/50 mb-4 group-hover:scale-110 transition-transform">
                                <span className="text-2xl font-serif leading-none opacity-80">֍</span>
                            </div>

                            <div className="relative z-10 w-full mb-auto flex flex-col items-center">
                                <span className="block mb-3 text-[11px] font-black tracking-[0.35em] uppercase text-gold-primary/80 dark:text-gold-light/80 drop-shadow-sm">
                                    CHAPTER {ch.chapter}
                                </span>
                                <h2 className="font-bold tracking-wide mb-4 text-text-primary dark:text-dark-text-primary font-noto-kr flex flex-col gap-1.5 mt-1">
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
