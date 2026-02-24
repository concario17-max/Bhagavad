import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { Moon, Sun, ChevronDown, Menu, Edit3 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useUI } from '../context/UIContext';

const Header = () => {
    const { theme, toggleTheme } = useTheme();
    const { toggleSidebar, toggleReflections } = useUI();
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
        <header className="sticky top-0 z-50 w-full border-b border-gold-primary/20 dark:border-dark-border/60 bg-white/60 dark:bg-[#070707]/60 backdrop-blur-xl transition-colors duration-500 shadow-sm">
            <div className={`container mx-auto flex h-16 items-center px-4 ${isVerseView ? 'justify-between max-w-[1400px]' : 'justify-center max-w-7xl'}`}>

                {/* Left Side: Logo (Only visible in Verse View to match Yoga Sutras) */}
                {isVerseView && (
                    <div className="flex items-center gap-2 sm:gap-4">
                        <button
                            onClick={toggleSidebar}
                            className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-gold-surface dark:hover:bg-dark-surface text-gold-primary dark:text-gold-light transition-colors"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <Link to="/" className="flex items-center gap-2.5 group">
                            <span className="text-xl font-serif text-gold-primary leading-none opacity-80 group-hover:scale-110 transition-transform">֍</span>
                            <span className="font-bold text-lg text-text-primary dark:text-dark-text-primary transition-colors font-crimson uppercase tracking-widest">
                                Bhagavad Gita
                            </span>
                        </Link>
                    </div>
                )}

                {/* Right Side: Selectors & Theme Toggle (Visible in Verse View) */}
                {isVerseView && (
                    <div className="flex items-center gap-3">
                        {chapters[chapterNum] && (
                            <div className="hidden sm:flex items-center gap-3 rounded-full bg-white/50 dark:bg-dark-surface/50 backdrop-blur-md border border-gold-primary/20 dark:border-dark-border/50 px-4 py-1.5 shadow-sm text-[13px] font-inter font-medium tracking-widest text-text-secondary dark:text-dark-text-secondary transition-all hover:shadow-md relative">
                                {/* Chapter Select */}
                                <div className="relative flex items-center gap-1 group">
                                    <span className="text-[#A68B5C] font-bold">CHAPTER {chapterNum}</span>
                                    <ChevronDown className="w-3.5 h-3.5 text-[#A68B5C]" strokeWidth={2.5} />
                                    <select
                                        value={chapterNum}
                                        onChange={handleChapterChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                    >
                                        {Object.keys(chapters).map(ch => (
                                            <option key={ch} value={ch}>Chapter {ch}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="w-[1px] h-3.5 bg-gold-primary/30 dark:bg-dark-border/80 mx-1"></div>

                                {/* Verse Select */}
                                <div className="relative flex items-center gap-1 group">
                                    <span className="opacity-80">SUTRA {verseNum}</span>
                                    <ChevronDown className="w-3.5 h-3.5 opacity-60" strokeWidth={2.5} />
                                    <select
                                        value={verseNum}
                                        onChange={handleVerseChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                    >
                                        {chapters[chapterNum].verses.map((v) => (
                                            <option key={v.verse} value={v.verse}>Sutra {v.verse}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={toggleReflections}
                            className="lg:hidden p-2 rounded-lg hover:bg-gold-surface dark:hover:bg-dark-surface text-gold-primary dark:text-gold-light transition-colors"
                        >
                            <Edit3 className="w-5 h-5" />
                        </button>

                        <button
                            onClick={toggleTheme}
                            className="p-2 ml-2 rounded-full hover:bg-gold-surface dark:hover:bg-dark-surface text-gold-primary transition-all duration-300"
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? <Sun className="w-4 h-4 sm:w-5 sm:h-5 opacity-80" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5 opacity-80" />}
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
