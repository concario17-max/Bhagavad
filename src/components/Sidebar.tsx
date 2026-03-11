import { useState, useEffect } from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { CHAPTER_DATA } from '../constants';
import { useUI } from '../context/UIContext';
import { fetchGitaData } from '../utils/dataFetcher';
import { GitaChapter } from '../types';

const Sidebar = () => {
    const { chapterNum, verseNum } = useParams<{ chapterNum: string; verseNum: string }>();
    const { isSidebarOpen, setIsSidebarOpen, isDesktopSidebarOpen } = useUI();
    const [chapters, setChapters] = useState<GitaChapter[]>([]);
    const [expandedChapter, setExpandedChapter] = useState<number | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchGitaData()
            .then(data => {
                if (data && typeof data === 'object') {
                    const chapterArray = Object.values(data) as GitaChapter[];
                    setChapters(chapterArray);
                }
            })
            .catch(err => console.error('Failed to load chapters:', err));
    }, []);

    useEffect(() => {
        if (chapterNum) {
            setExpandedChapter(parseInt(chapterNum));
        }
    }, [chapterNum]);

    const toggleChapter = (chNum: number) => {
        setExpandedChapter(chNum);
        navigate(`/chapter/${chNum}/verse/1`);
    };

    const currentChapter = chapters.find(ch => ch.chapter === expandedChapter);

    return (
        <>
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity duration-300 opacity-100 touch-none"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <aside className={`fixed inset-y-0 left-0 z-50 bg-white/40 dark:bg-dark-surface/40 backdrop-blur-md border-r border-gold-primary/20 dark:border-dark-border/50 h-[100dvh] lg:h-[calc(100vh-64px)] lg:sticky lg:top-16 transform transition-all duration-300 flex flex-col font-inter overscroll-contain
                ${isSidebarOpen ? 'w-80 translate-x-0 overflow-hidden shadow-2xl lg:shadow-none' : 'w-80 -translate-x-full lg:translate-x-0'}
                ${isDesktopSidebarOpen ? 'lg:w-80 lg:opacity-100' : 'lg:w-0 lg:opacity-0 lg:border-none lg:-translate-x-10 p-0 overflow-hidden'}
            `}>

                <div className="lg:hidden flex items-center justify-between p-4 border-b border-gold-border/30 dark:border-[#333] shrink-0">
                    <span className="font-crimson font-bold text-lg text-text-primary dark:text-dark-text-primary">장 (Chapter)</span>
                    <button onClick={() => setIsSidebarOpen(false)} className="p-2 -mr-2 rounded-full hover:bg-gold-surface dark:hover:bg-dark-surface text-text-secondary dark:text-dark-text-secondary transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto border-b border-gold-border/40 dark:border-[#222] custom-scrollbar min-h-0 overscroll-contain">
                    <div className="p-4 bg-transparent sticky top-0 z-10 backdrop-blur-sm hidden lg:block">
                        <h2 className="text-xs font-bold text-text-primary/70 dark:text-dark-text-primary/70">
                            장 (Chapter)
                        </h2>
                    </div>
                    <div className="py-1 px-2 space-y-0.5">
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
                                    className={`w-full flex items-start justify-between gap-1.5 px-2 py-1.5 sm:px-1.5 sm:py-1 rounded-lg text-left transition-colors ${isExpanded
                                        ? 'bg-white/60 dark:bg-dark-bg/60 shadow-sm border border-gold-primary/20 text-[#1C2B36] dark:text-gold-light'
                                        : 'text-[#5B7282] dark:text-dark-text-secondary hover:bg-gold-surface/40 dark:hover:bg-dark-bg/40 border border-transparent'
                                        }`}
                                >
                                    <div className="flex-1 pr-1 flex flex-col pt-0">
                                        <span className={`text-[14px] sm:text-[13px] leading-snug font-inter break-keep ${isExpanded ? 'font-bold text-[#1C2B36]' : 'font-bold'}`}>
                                            {ch.chapter}. {mainTitle}
                                        </span>
                                        {subTitle && (
                                            <span className={`text-[12px] sm:text-[11.5px] font-inter break-keep mt-0 ${isExpanded ? 'opacity-50 text-[#1C2B36] font-medium' : 'opacity-60 font-medium'}`}>
                                                {subTitle}
                                            </span>
                                        )}
                                    </div>
                                    <span className={`shrink-0 mt-0 text-[#A68B5C] px-1.5 py-0.5 rounded text-[11px] font-bold ${isExpanded ? 'opacity-100' : 'opacity-70'}`}>
                                        {ch.verses.length}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto bg-transparent custom-scrollbar overscroll-contain">
                    <div className="py-1 px-2 space-y-0">
                        {currentChapter ? (
                            currentChapter.verses.map((v, idx) => {
                                const nextV = currentChapter.verses[idx + 1];
                                let displayVerse = `${currentChapter.chapter}.${v.verse}`;

                                if (nextV && nextV.verse > v.verse + 1) {
                                    displayVerse = `${currentChapter.chapter}.${v.verse}-${nextV.verse - 1}`;
                                }

                                const verseText = v.iast ? v.iast.split('\n')[0].substring(0, 40) + '...' : `Verse ${v.verse}`;

                                return (
                                    <NavLink
                                        key={v.verse}
                                        to={`/chapter/${currentChapter.chapter}/verse/${v.verse}`}
                                        onClick={() => setIsSidebarOpen(false)}
                                        className={({ isActive }) =>
                                            `flex items-start gap-2 px-3 py-2 sm:px-2 sm:py-1.5 rounded-lg text-sm transition-all ${isActive
                                                ? 'bg-white/60 border border-gold-primary/30 text-text-primary font-medium shadow-sm dark:bg-dark-bg/60 dark:border-gold-primary/20 dark:text-gold-light'
                                                : 'border border-transparent text-text-secondary dark:text-dark-text-secondary hover:text-text-primary hover:bg-gold-surface/30 dark:hover:bg-dark-bg/40'
                                            }`
                                        }
                                    >
                                        <span className={`min-w-[45px] whitespace-nowrap font-bold text-xs sm:text-[13px] mt-[2px] ${v.chapter === parseInt(chapterNum || '1') && v.verse === parseInt(verseNum || '1') ? 'text-gold-primary' : 'text-text-secondary/60 dark:text-dark-text-secondary/60'}`}>{displayVerse}</span>
                                        <span className="truncate opacity-90 text-[14px] sm:text-[13px] leading-relaxed font-inter">
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
            </aside >
        </>
    );
};

export default Sidebar;
