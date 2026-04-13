import { createPortal } from 'react-dom';
import { useEffect, useMemo, useRef, useState } from 'react';
import { matchPath, useLocation, useNavigate } from 'react-router-dom';
import { fetchGitaData } from '../utils/dataFetcher';
import { getChapterMeta } from '../utils/chapterMeta';
import { getVerseRange } from '../utils/verse';
import { GitaChapter } from '../types';

const VERSE_ROUTE_PATTERN = '/chapter/:chapterNum/verse/:verseNum';

const ChapterVerseSelector = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const verseRouteMatch = matchPath(VERSE_ROUTE_PATTERN, location.pathname);
    const [isMobile, setIsMobile] = useState(false);
    const [isMobileVisible, setIsMobileVisible] = useState(true);
    const lastScrollYRef = useRef(0);

    const [chapters, setChapters] = useState<GitaChapter[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedChapter, setSelectedChapter] = useState('');
    const [selectedVerse, setSelectedVerse] = useState('');

    useEffect(() => {
        let cancelled = false;

        fetchGitaData()
            .then(data => {
                if (cancelled) {
                    return;
                }

                setChapters(Object.values(data));
            })
            .catch(() => {
                if (!cancelled) {
                    setChapters([]);
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setIsLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 1023px)');

        const syncViewport = () => {
            setIsMobile(mediaQuery.matches);
        };

        syncViewport();
        mediaQuery.addEventListener('change', syncViewport);

        return () => {
            mediaQuery.removeEventListener('change', syncViewport);
        };
    }, []);

    useEffect(() => {
        if (!isMobile) {
            return;
        }

        setIsMobileVisible(true);
        lastScrollYRef.current = window.scrollY;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const delta = currentScrollY - lastScrollYRef.current;

            if (currentScrollY < 24) {
                setIsMobileVisible(true);
            } else if (delta > 8) {
                setIsMobileVisible(false);
            } else if (delta < -8) {
                setIsMobileVisible(true);
            }

            lastScrollYRef.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isMobile]);

    useEffect(() => {
        if (!isMobile) {
            return;
        }

        setIsMobileVisible(true);
        lastScrollYRef.current = window.scrollY;
    }, [isMobile, location.pathname]);

    useEffect(() => {
        if (!verseRouteMatch?.params.chapterNum || !verseRouteMatch.params.verseNum) {
            return;
        }

        setSelectedChapter(verseRouteMatch.params.chapterNum);
        setSelectedVerse(verseRouteMatch.params.verseNum);
    }, [verseRouteMatch?.params.chapterNum, verseRouteMatch?.params.verseNum]);

    const selectedChapterData = useMemo(() => {
        if (!selectedChapter) {
            return null;
        }

        return chapters.find(chapter => chapter.chapter === Number.parseInt(selectedChapter, 10)) ?? null;
    }, [chapters, selectedChapter]);

    const chapterOptions = useMemo(() => {
        return chapters.map(chapter => {
            const chapterMeta = getChapterMeta(chapter);
            const label = chapterMeta.subtitle
                ? `${chapter.chapter}. ${chapterMeta.mainTitle} ${chapterMeta.subtitle}`
                : `${chapter.chapter}. ${chapterMeta.displayTitle}`;

            return {
                value: String(chapter.chapter),
                label
            };
        });
    }, [chapters]);

    const verseOptions = useMemo(() => {
        if (!selectedChapterData) {
            return [];
        }

        return selectedChapterData.verses.map(verse => {
            const verseRange = getVerseRange(selectedChapterData, verse);

            return {
                value: String(verse.verse),
                label: `${selectedChapterData.chapter}.${verseRange}`
            };
        });
    }, [selectedChapterData]);

    const handleChapterChange = (value: string) => {
        setSelectedChapter(value);
        setSelectedVerse('');
    };

    const handleVerseChange = (value: string) => {
        setSelectedVerse(value);

        if (!selectedChapter || !value) {
            return;
        }

        navigate(`/chapter/${selectedChapter}/verse/${value}`);
    };

    const selectorFields = (
        <>
            <label className="flex flex-col gap-1.5 rounded-2xl border border-gold-primary/14 bg-white/70 px-3 py-2.5 text-left shadow-sm dark:border-dark-border/60 dark:bg-dark-surface/70">
                <span className="text-[10px] font-black uppercase tracking-[0.28em] text-gold-primary/80 dark:text-gold-light/80">
                    Chapter
                </span>
                <select
                    className="w-full appearance-none bg-transparent text-[14px] font-semibold text-text-primary outline-none transition-colors focus:text-gold-primary dark:text-dark-text-primary"
                    value={selectedChapter}
                    disabled={isLoading}
                    onChange={event => handleChapterChange(event.target.value)}
                    aria-label="Select chapter"
                >
                    <option value="">{isLoading ? 'Loading chapters' : 'Select chapter'}</option>
                    {chapterOptions.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </label>

            <label className="flex flex-col gap-1.5 rounded-2xl border border-gold-primary/14 bg-white/70 px-3 py-2.5 text-left shadow-sm dark:border-dark-border/60 dark:bg-dark-surface/70">
                <span className="text-[10px] font-black uppercase tracking-[0.28em] text-gold-primary/80 dark:text-gold-light/80">
                    Verse
                </span>
                <select
                    className="w-full appearance-none bg-transparent text-[14px] font-semibold text-text-primary outline-none transition-colors focus:text-gold-primary disabled:cursor-not-allowed disabled:opacity-50 dark:text-dark-text-primary"
                    value={selectedVerse}
                    disabled={!selectedChapter || isLoading}
                    onChange={event => handleVerseChange(event.target.value)}
                    aria-label="Select verse"
                >
                    <option value="">{selectedChapter ? 'Select verse' : 'Select chapter first'}</option>
                    {verseOptions.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </label>
        </>
    );

    if (isMobile) {
        return createPortal(
            <div
                className={`fixed left-1/2 top-[calc(env(safe-area-inset-top)+4.5rem)] z-40 w-[min(92vw,28rem)] -translate-x-1/2 transition-all duration-300 ease-out ${isMobileVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}
                aria-hidden={!isMobileVisible}
            >
                <div className="rounded-[26px] border border-gold-primary/12 bg-white/90 px-2.5 py-2 shadow-[0_20px_60px_-36px_rgba(78,56,22,0.42)] backdrop-blur-xl dark:border-dark-border/70 dark:bg-dark-surface/88">
                    <div className="grid grid-cols-2 gap-2">
                        {selectorFields}
                    </div>
                </div>
            </div>,
            document.body
        );
    }

    return (
        <div className="w-full max-w-5xl">
            <div className="grid gap-2 sm:grid-cols-2">
                {selectorFields}
            </div>
        </div>
    );
};

export default ChapterVerseSelector;
