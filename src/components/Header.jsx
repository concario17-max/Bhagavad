import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { Moon, Sun, ChevronDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Header = () => {
    const { theme, toggleTheme } = useTheme();
    const { chapterNum, verseNum } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [chapters, setChapters] = useState({});
    const isVerseView = location.pathname.includes('/chapter/') && location.pathname.includes('/verse/');

    useEffect(() => {
        if (isVerseView) {
            fetch('/gita.json')
                .then(res => res.json())
                .then(data => setChapters(data))
                .catch(err => console.error('Failed to load menu data:', err));
        }
    }, [isVerseView]);

    const handleChapterChange = (e) => {
        const newCh = e.target.value;
        navigate(`/chapter/${newCh}/verse/1`);
    };

    const handleVerseChange = (e) => {
        const newV = e.target.value;
        navigate(`/chapter/${chapterNum}/verse/${newV}`);
    };

    const romanize = (num) => {
        const lookup = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 };
        let roman = '';
        for (let i in lookup) {
            while (num >= lookup[i]) {
                roman += i;
                num -= lookup[i];
            }
        }
        return roman;
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-nisha-bg/80 backdrop-blur-sm transition-colors duration-300">
            <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
                <div className="flex items-center gap-6">
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <span className="font-bold text-xl text-prakash-primary dark:text-nisha-primary transition-colors group-hover:opacity-80">Bhagavad Gita</span>
                    </Link>
                </div>
                <div className="flex items-center gap-4">
                    {isVerseView && chapters[chapterNum] && (
                        <div className="flex items-center gap-1.5 p-1 px-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 scale-90 sm:scale-100 mr-2">
                            <div className="relative flex items-center">
                                <select
                                    value={chapterNum}
                                    onChange={handleChapterChange}
                                    className="appearance-none bg-transparent pl-2 pr-6 py-1 text-sm font-semibold text-gray-700 dark:text-gray-300 focus:outline-none cursor-pointer"
                                >
                                    {Object.keys(chapters).map(ch => (
                                        <option key={ch} value={ch}>{romanize(parseInt(ch))}</option>
                                    ))}
                                </select>
                                <ChevronDown className="w-3 h-3 absolute right-1.5 pointer-events-none text-gray-400" />
                            </div>
                            <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-1"></div>
                            <div className="relative flex items-center">
                                <select
                                    value={verseNum}
                                    onChange={handleVerseChange}
                                    className="appearance-none bg-transparent pl-2 pr-6 py-1 text-sm font-semibold text-gray-700 dark:text-gray-300 focus:outline-none cursor-pointer"
                                >
                                    {chapters[chapterNum].verses.map(v => (
                                        <option key={v.verse} value={v.verse}>Sutra {v.verse}</option>
                                    ))}
                                </select>
                                <ChevronDown className="w-3 h-3 absolute right-1.5 pointer-events-none text-gray-400" />
                            </div>
                        </div>
                    )}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
