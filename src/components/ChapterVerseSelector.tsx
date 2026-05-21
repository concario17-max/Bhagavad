import { useEffect, useMemo, useState } from 'react';
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
        setSelectedVerse('');
    };

    const handleVerseChange = (value: string) => {
        setSelectedVerse(value);

        if (!selectedChapter || !value) {
            return;
        }

        navigate(`/chapter/${selectedChapter}/verse/${value}`);
    };

    return (
        <div className="grid min-w-0 grid-cols-2 divide-x divide-gold-primary/12 dark:divide-dark-border/70">
            <label className="flex min-w-0 flex-col gap-1.5 px-3 py-2.5 text-left sm:px-4">
                <span className="text-[9px] font-black uppercase tracking-[0.24em] text-gold-primary/80 dark:text-gold-light/80">
                    Chapter
                </span>
                <select
                    className="w-full min-w-0 appearance-none bg-transparent text-[13px] font-semibold text-text-primary outline-none transition-colors focus:text-gold-primary dark:text-dark-text-primary"
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

            <label className="flex min-w-0 flex-col gap-1.5 px-3 py-2.5 text-left sm:px-4">
                <span className="text-[9px] font-black uppercase tracking-[0.24em] text-gold-primary/80 dark:text-gold-light/80">
                    Verse
                </span>
                <select
                    className="w-full min-w-0 appearance-none bg-transparent text-[13px] font-semibold text-text-primary outline-none transition-colors focus:text-gold-primary disabled:cursor-not-allowed disabled:opacity-50 dark:text-dark-text-primary"
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
        </div>
    );
};

export default ChapterVerseSelector;
