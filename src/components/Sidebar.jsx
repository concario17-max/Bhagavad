import { useState, useEffect } from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight, BookOpen, X } from 'lucide-react';
import { CHAPTER_DATA } from '../constants';
import { useUI } from '../context/UIContext';

const Sidebar = () => {
    const { chapterNum, verseNum } = useParams();
    const { isSidebarOpen, setIsSidebarOpen } = useUI();
    const [chapters, setChapters] = useState([]);
    const [expandedChapter, setExpandedChapter] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/gita.json')
            .then(res => res.json())
            .then(data => {
                if (data && typeof data === 'object') {
                    const chapterArray = Object.values(data);
                    setChapters(chapterArray);
                }
            })
            .catch(err => console.error('Failed to load chapters:', err));
    }, []);

    // Auto-expand the current chapter based on URL
    useEffect(() => {
        if (chapterNum) {
            setExpandedChapter(parseInt(chapterNum));
        }
    }, [chapterNum]);

    const toggleChapter = (chNum) => {
        setExpandedChapter(chNum);
        navigate(`/chapter/${chNum}/verse/1`);
    };

    const currentChapter = chapters.find(ch => ch.chapter === expandedChapter);

    return (
        <>
            {/* Mobile Backdrop */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity duration-300 opacity-100"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <aside className={`fixed inset-y-0 left-0 z-50 w-80 bg-white/40 dark:bg-dark-surface/40 backdrop-blur-md border-r border-gold-primary/20 dark:border-dark-border/50 h-full lg:h-[calc(100vh-64px)] lg:sticky lg:top-16 transform transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0 overflow-hidden shadow-2xl lg:shadow-none' : '-translate-x-full'} flex flex-col font-inter`}>

                {/* Mobile Close Button & Header */}
                <div className="lg:hidden flex items-center justify-between p-4 border-b border-gold-border/30 dark:border-[#333] shrink-0">
                    <span className="font-crimson font-bold text-lg text-text-primary dark:text-dark-text-primary">장 (Chapter)</span>
                    <button onClick={() => setIsSidebarOpen(false)} className="p-2 -mr-2 rounded-full hover:bg-gold-surface dark:hover:bg-dark-surface text-text-secondary dark:text-dark-text-secondary transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Top Half: Chapters */}
                <div className="flex-1 overflow-y-auto border-b border-gold-border/40 dark:border-[#222] custom-scrollbar min-h-0">
                    <div className="p-4 bg-transparent sticky top-0 z-10 backdrop-blur-sm hidden lg:block">
                        <h2 className="text-xs font-bold text-text-primary/70 dark:text-dark-text-primary/70">
                            장 (Chapter)
                        </h2>
                    </div>
                    <div className="py-2 px-3 space-y-1">
                        {chapters.map((ch) => {
                            const isExpanded = expandedChapter === ch.chapter;
                            const title = CHAPTER_DATA[ch.chapter]?.name_korean || ch.name_translated || "";

                            const hasSub = title.includes('(');
                            const mainTitle = hasSub ? title.substring(0, title.indexOf('(')).trim() : title;
                            const subTitle = hasSub ? title.substring(title.indexOf('(')).trim() : "";

                            return (
                                <button
                                    key={ch.chapter}
                                    onClick={() => toggleChapter(ch.chapter)}
                                    className={`w-full flex items-start justify-between gap-2 px-3 py-3 rounded-xl text-left transition-colors ${isExpanded
                                        ? 'bg-white/60 dark:bg-dark-bg/60 shadow-sm border border-gold-primary/20 text-[#1C2B36] dark:text-gold-light'
                                        : 'text-[#5B7282] dark:text-dark-text-secondary hover:bg-gold-surface/40 dark:hover:bg-dark-bg/40 border border-transparent'
                                        }`}
                                >
                                    <div className="flex-1 pr-2 flex flex-col gap-0.5">
                                        <span className={`text-[15px] leading-snug font-inter break-keep ${isExpanded ? 'font-bold text-[#1C2B36]' : 'font-bold'}`}>
                                            {ch.chapter}. {mainTitle}
                                        </span>
                                        {subTitle && (
                                            <span className={`text-[13px] font-inter break-keep mt-0.5 ${isExpanded ? 'opacity-50 text-[#1C2B36] font-medium' : 'opacity-60 font-medium'}`}>
                                                {subTitle}
                                            </span>
                                        )}
                                    </div>
                                    <span className={`shrink-0 mt-0.5 text-[#A68B5C] px-2 py-0.5 rounded text-xs font-bold ${isExpanded ? 'opacity-100' : 'opacity-70'}`}>
                                        {ch.verses.length}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Bottom Half: Verses */}
                <div className="flex-1 overflow-y-auto bg-transparent custom-scrollbar">
                    <div className="py-2 px-3 space-y-0.5">
                        {currentChapter ? (
                            currentChapter.verses.map((v, idx) => {
                                // Find the end verse if it's a range
                                const nextV = currentChapter.verses[idx + 1];
                                let displayVerse = `${currentChapter.chapter}.${v.verse}`;

                                // Check for gap
                                if (nextV && nextV.verse > v.verse + 1) {
                                    displayVerse = `${currentChapter.chapter}.${v.verse}-${nextV.verse - 1}`;
                                } else if (!nextV) {
                                    // Handle last verse if needed
                                }

                                // Verse text preview - taking first few words of IAST
                                const verseText = v.iast ? v.iast.split('\n')[0].substring(0, 40) + '...' : `Verse ${v.verse}`;

                                return (
                                    <NavLink
                                        key={v.verse}
                                        to={`/chapter/${currentChapter.chapter}/verse/${v.verse}`}
                                        className={({ isActive }) =>
                                            `flex items-start gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${isActive
                                                ? 'bg-white/60 border border-gold-primary/30 text-text-primary font-medium shadow-sm dark:bg-dark-bg/60 dark:border-gold-primary/20 dark:text-gold-light'
                                                : 'border border-transparent text-text-secondary dark:text-dark-text-secondary hover:text-text-primary hover:bg-gold-surface/30 dark:hover:bg-dark-bg/40'
                                            }`
                                        }
                                    >
                                        <span className={`min-w-[55px] whitespace-nowrap font-bold text-xs mt-[3px] ${v.chapter === parseInt(chapterNum) && v.verse === parseInt(verseNum) ? 'text-gold-primary' : 'text-text-secondary/60 dark:text-dark-text-secondary/60'}`}>{displayVerse}</span>
                                        <span className="truncate opacity-90 text-[13px] leading-relaxed font-inter">
                                            {verseText}
                                        </span>
                                    </NavLink>
                                );
                            })
                        ) : (
                            <div className="p-8 text-center text-text-secondary dark:text-dark-text-secondary text-sm">
                                Select a chapter to view verses
                            </div>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
