import { useState, useEffect } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { ChevronDown, ChevronRight, BookOpen, X } from 'lucide-react';
import { CHAPTER_DATA } from '../constants';
import { useUI } from '../context/UIContext';

const Sidebar = () => {
    const { chapterNum, verseNum } = useParams();
    const { isSidebarOpen, setIsSidebarOpen } = useUI();
    const [chapters, setChapters] = useState([]);
    const [expandedChapter, setExpandedChapter] = useState(null);

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

            <aside className={`fixed inset-y-0 left-0 z-50 w-80 bg-gold-bg/95 dark:bg-[#111] border-r border-gold-border/40 dark:border-[#222] h-full lg:h-[calc(100vh-64px)] lg:sticky lg:top-16 transform transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0 overflow-hidden' : '-translate-x-full'} flex flex-col font-inter`}>

                {/* Mobile Close Button & Header */}
                <div className="lg:hidden flex items-center justify-between p-4 border-b border-gold-border/30 dark:border-[#333] shrink-0">
                    <span className="font-crimson font-bold text-lg text-text-primary dark:text-dark-text-primary">챕터 (파다)</span>
                    <button onClick={() => setIsSidebarOpen(false)} className="p-2 -mr-2 rounded-full hover:bg-gold-surface dark:hover:bg-dark-surface text-text-secondary dark:text-dark-text-secondary transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Top Half: Chapters */}
                <div className="flex-1 overflow-y-auto border-b border-gold-border/40 dark:border-[#222] custom-scrollbar min-h-0">
                    <div className="p-4 bg-transparent sticky top-0 z-10 backdrop-blur-sm hidden lg:block">
                        <h2 className="text-xs font-bold text-text-primary/70 dark:text-dark-text-primary/70">
                            챕터 (파다)
                        </h2>
                    </div>
                    <div className="py-2 px-3 space-y-1">
                        {chapters.map((ch) => {
                            const isExpanded = expandedChapter === ch.chapter;

                            return (
                                <button
                                    key={ch.chapter}
                                    onClick={() => toggleChapter(ch.chapter)}
                                    className={`w-full flex items-start justify-between gap-2 px-3 py-2.5 rounded-lg text-left transition-colors ${isExpanded
                                        ? 'bg-gold-surface dark:bg-[#222] text-text-primary dark:text-gold-light font-medium'
                                        : 'text-text-secondary dark:text-dark-text-secondary hover:bg-gold-surface/50 dark:hover:bg-[#1a1a1a]'
                                        }`}
                                >
                                    <div className="flex-1 pr-2">
                                        <span className="text-sm leading-snug font-inter font-bold break-keep">
                                            {ch.chapter}. {CHAPTER_DATA[ch.chapter]?.name_korean || ch.name_translated}
                                        </span>
                                    </div>
                                    <span className={`shrink-0 mt-0.5 text-[#A68B5C] bg-[#F5EFE6] dark:bg-[#222] px-2 py-0.5 rounded text-xs font-bold ${isExpanded ? 'opacity-100' : 'opacity-70'}`}>
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
                                                ? 'bg-gold-surface border border-gold-border/50 text-text-primary font-medium shadow-sm dark:bg-[#222] dark:border-[#333] dark:text-gold-light'
                                                : 'border border-transparent text-text-secondary dark:text-dark-text-secondary hover:text-text-primary hover:bg-gold-surface/30 dark:hover:bg-[#1a1a1a]'
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
