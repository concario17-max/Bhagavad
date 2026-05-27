import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
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

        const nextChapter = chapters.find(chapter => chapter.chapter === Number.parseInt(value, 10)) ?? null;
        const nextVerse = nextChapter?.verses[0]?.verse;

        if (!value || !nextVerse) {
            setSelectedVerse('');
            return;
        }

        const nextVerseValue = String(nextVerse);
        setSelectedVerse(nextVerseValue);
        navigate(`/chapter/${value}/verse/${nextVerseValue}`);
    };

    const handleVerseChange = (value: string) => {
        setSelectedVerse(value);

        if (!selectedChapter || !value) {
            return;
        }

        navigate(`/chapter/${selectedChapter}/verse/${value}`);
    };

    return (
        <div className="flex min-w-0 flex-col gap-2 p-2 sm:flex-row sm:items-stretch sm:gap-2 sm:p-2.5">
            <label className="group flex min-w-0 flex-1 items-center gap-2 rounded-[22px] border border-gold-primary/12 bg-white/86 px-3.5 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] transition-colors focus-within:border-gold-primary/30 focus-within:bg-white dark:border-dark-border/70 dark:bg-dark-surface/86 dark:shadow-none">
                <div className="flex min-w-0 flex-1 flex-col">
                    <span className="text-[9px] font-black uppercase tracking-[0.24em] text-gold-primary/78 dark:text-gold-light/78">
                        Chapter
                    </span>
                    <select
                        className="mt-0.5 w-full min-w-0 appearance-none bg-transparent pr-6 text-[13px] font-semibold text-text-primary outline-none transition-colors focus:text-gold-primary disabled:cursor-not-allowed disabled:opacity-50 dark:text-dark-text-primary"
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
                </div>
                <ChevronDown className="pointer-events-none h-4 w-4 shrink-0 text-gold-primary/55 transition-colors group-focus-within:text-gold-primary dark:text-gold-light/50" />
            </label>

            <div className="hidden items-center justify-center px-0.5 text-gold-primary/35 dark:text-gold-light/30 sm:flex">
                <ChevronRight className="h-4 w-4" />
            </div>

            <label className="group flex min-w-0 flex-1 items-center gap-2 rounded-[22px] border border-gold-primary/12 bg-white/86 px-3.5 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] transition-colors focus-within:border-gold-primary/30 focus-within:bg-white dark:border-dark-border/70 dark:bg-dark-surface/86 dark:shadow-none">
                <div className="flex min-w-0 flex-1 flex-col">
                    <span className="text-[9px] font-black uppercase tracking-[0.24em] text-gold-primary/78 dark:text-gold-light/78">
                        Verse
                    </span>
                    <select
                        className="mt-0.5 w-full min-w-0 appearance-none bg-transparent pr-6 text-[13px] font-semibold text-text-primary outline-none transition-colors focus:text-gold-primary disabled:cursor-not-allowed disabled:opacity-50 dark:text-dark-text-primary"
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
                </div>
                <ChevronDown className="pointer-events-none h-4 w-4 shrink-0 text-gold-primary/55 transition-colors group-focus-within:text-gold-primary dark:text-gold-light/50" />
            </label>
        </div>
    );
};

export default ChapterVerseSelector;
