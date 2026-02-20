import { useState, useEffect } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { ChevronDown, ChevronRight, BookOpen } from 'lucide-react';
import { CHAPTER_DATA } from '../constants';

const Sidebar = () => {
    const { chapterNum, verseNum } = useParams();
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
        <aside className="w-80 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-[calc(100vh-64px)] sticky top-16 hidden lg:flex flex-col font-inter">
            {/* Top Half: Chapters */}
            <div className="flex-1 overflow-y-auto border-b border-gray-200 dark:border-gray-800">
                <div className="p-4 bg-gray-50 dark:bg-gray-900 sticky top-0 z-10 border-b border-gray-200/50 dark:border-gray-800/50">
                    <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Chapters
                    </h2>
                </div>
                <div className="py-2">
                    {chapters.map((ch) => {
                        const isExpanded = expandedChapter === ch.chapter;

                        return (
                            <button
                                key={ch.chapter}
                                onClick={() => toggleChapter(ch.chapter)}
                                className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${isExpanded
                                    ? 'bg-orange-100 dark:bg-gray-800 text-prakash-primary dark:text-nisha-primary font-bold'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className={`text-sm ${isExpanded ? 'opacity-100' : 'opacity-70'}`}>
                                        {ch.chapter}.
                                    </span>
                                    <span className="text-sm truncate">
                                        {CHAPTER_DATA[ch.chapter]?.name || ch.name_translated}
                                    </span>
                                </div>
                                <span className={`text-xs font-medium ${isExpanded ? 'text-prakash-primary dark:text-nisha-primary' : 'text-gray-400'}`}>
                                    {ch.verses.length}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Bottom Half: Verses */}
            <div className="flex-1 overflow-y-auto bg-white dark:bg-black/20">
                <div className="p-4 bg-white/95 dark:bg-gray-900/95 sticky top-0 z-10 border-b border-gray-100 dark:border-gray-800 backdrop-blur-sm">
                    <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {currentChapter ? `Verses of Ch ${currentChapter.chapter}` : 'Select a Chapter'}
                    </h2>
                </div>
                <div className="py-2">
                    {currentChapter ? (
                        currentChapter.verses.map((v, idx) => {
                            // Find the end verse if it's a range
                            const nextV = currentChapter.verses[idx + 1];
                            let displayVerse = `${currentChapter.chapter}.${v.verse}`;

                            // Check for gap
                            if (nextV && nextV.verse > v.verse + 1) {
                                displayVerse = `${currentChapter.chapter}.${v.verse}-${nextV.verse - 1}`;
                            } else if (!nextV) {
                                // For the last verse, we might need to know the total count if given, 
                                // but our JSON structure usually marks the end in the next verse's start.
                                // If this is a grouped verse, it might have internal markers or we can handle it specially.
                                // Based on gita.json, the last verses are rarely grouped at the end.
                            }

                            // Verse text preview - taking first few words of IAST
                            const verseText = v.iast ? v.iast.split('\n')[0].substring(0, 40) + '...' : `Verse ${v.verse}`;

                            return (
                                <NavLink
                                    key={v.verse}
                                    to={`/chapter/${currentChapter.chapter}/verse/${v.verse}`}
                                    className={({ isActive }) =>
                                        `flex items-start gap-2 px-4 py-3 text-sm transition-all border-l-4 ${isActive
                                            ? 'border-prakash-primary dark:border-nisha-primary bg-orange-50 dark:bg-yellow-900/20 text-gray-900 dark:text-gray-100 font-medium'
                                            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                        }`
                                    }
                                >
                                    <span className="min-w-[40px] font-medium text-xs opacity-70 mt-0.5 whitespace-nowrap">{displayVerse}</span>
                                    <span className="truncate opacity-90 text-xs leading-relaxed font-crimson italic">
                                        {verseText}
                                    </span>
                                </NavLink>
                            );
                        })
                    ) : (
                        <div className="p-8 text-center text-gray-400 text-sm">
                            Select a chapter to view verses
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
