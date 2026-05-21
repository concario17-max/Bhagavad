import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VerseCommentary from '../components/VerseCommentary';
import VerseDeepDivePanel from '../components/verse/VerseDeepDivePanel';
import VerseMessageState from '../components/verse/VerseMessageState';
import VerseTranslationsSection from '../components/verse/VerseTranslationsSection';
import { ContentReader } from '../components/ui/ContentReader';
import { useVerseData } from '../context/VerseDataContext';
import { getTranslationDefinitions } from '../utils/content';
import { withBasePath } from '../utils/paths';
import { getNextVersePath, getPreviousVersePath } from '../utils/verse';

type RightPanelMode = 'commentary' | 'deep-dive';

const RIGHT_PANEL_STORAGE_PREFIX = 'gita:verse-right-panel-mode';

const getRightPanelStorageKey = (chapterNum: string, verseRange: string) => `${RIGHT_PANEL_STORAGE_PREFIX}:${chapterNum}:${verseRange}`;

const VerseView = () => {
    const navigate = useNavigate();
    const {
        allChapters,
        chapterNum,
        currentChapter,
        currentChapterNumber,
        errorMessage,
        requestedVerseNumber,
        resolvedVerseNumber,
        status,
        verseData,
        verseRange
    } = useVerseData();
    const [rightPanelMode, setRightPanelMode] = useState<RightPanelMode>('commentary');

    useEffect(() => {
        if (!resolvedVerseNumber || resolvedVerseNumber === requestedVerseNumber) {
            return;
        }

        navigate(`/chapter/${chapterNum}/verse/${resolvedVerseNumber}`, { replace: true });
    }, [chapterNum, navigate, requestedVerseNumber, resolvedVerseNumber]);

    useEffect(() => {
        if (typeof window === 'undefined' || !chapterNum || !verseRange) {
            setRightPanelMode('commentary');
            return;
        }

        const savedMode = window.localStorage.getItem(getRightPanelStorageKey(chapterNum, verseRange));
        if (savedMode === 'commentary' || savedMode === 'deep-dive') {
            setRightPanelMode(savedMode);
            return;
        }

        setRightPanelMode('commentary');
    }, [chapterNum, verseRange]);

    useEffect(() => {
        if (typeof window === 'undefined' || !chapterNum || !verseRange) {
            return;
        }

        window.localStorage.setItem(getRightPanelStorageKey(chapterNum, verseRange), rightPanelMode);
    }, [chapterNum, rightPanelMode, verseRange]);

    if (status === 'loading') {
        return <div className="min-h-screen flex items-center justify-center bg-gold-bg dark:bg-dark-bg"><div className="w-8 h-8 border-4 border-gold-primary border-t-transparent rounded-full animate-spin"></div></div>;
    }

    if (status !== 'ready' || !allChapters || !currentChapter || !verseData) {
        return (
            <ContentReader maxWidth="max-w-[1120px]">
                <VerseMessageState
                    title={status === 'error' ? 'Reader Unavailable' : 'Verse Not Found'}
                    description={errorMessage ?? 'The requested verse could not be prepared for reading.'}
                />
            </ContentReader>
        );
    }

    const previousVersePath = getPreviousVersePath(allChapters, chapterNum, verseData);
    const nextVersePath = getNextVersePath(allChapters, chapterNum, verseData);
    const audioFilename = verseData.audio?.split('/').pop();
    const audioSrc = audioFilename ? withBasePath(`mp3/${audioFilename}`) : undefined;
    const translationSections = getTranslationDefinitions(verseData);

    return (
        <div className="mx-auto h-full min-h-0 w-full max-w-[1840px] px-3 py-6 sm:px-5 lg:px-6 lg:py-4 lg:overflow-hidden">
            <div className="flex min-h-0 w-full flex-col gap-8 lg:grid lg:h-full lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-6">
                <div className="min-w-0 lg:min-h-0 lg:overflow-y-auto lg:pr-2">
                    <VerseTranslationsSection sections={translationSections} />
                </div>

                <div className="min-w-0 lg:min-h-0 lg:overflow-y-auto lg:pl-2">
                    <div className="mb-4 flex items-center justify-between gap-3 rounded-[26px] border border-gold-primary/14 bg-white/70 px-4 py-3 shadow-[0_16px_54px_-36px_rgba(78,56,22,0.48)] backdrop-blur-xl dark:border-dark-border/70 dark:bg-dark-surface/72">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold-muted dark:text-gold-muted">
                            {rightPanelMode === 'commentary' ? 'Commentary' : '심화'}
                        </span>
                        <button
                            type="button"
                            onClick={() => setRightPanelMode(previous => (previous === 'commentary' ? 'deep-dive' : 'commentary'))}
                            aria-pressed={rightPanelMode === 'deep-dive'}
                            className="inline-flex items-center rounded-full border border-gold-primary/20 bg-white/80 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-text-secondary transition-colors hover:border-gold-primary/40 hover:text-gold-primary aria-pressed:border-gold-primary/45 aria-pressed:bg-gold-surface/90 aria-pressed:text-gold-primary dark:border-dark-border/70 dark:bg-dark-bg/50 dark:text-dark-text-secondary dark:hover:text-gold-light dark:aria-pressed:border-gold-light/40 dark:aria-pressed:bg-dark-surface/90 dark:aria-pressed:text-gold-light"
                        >
                            심화
                        </button>
                    </div>

                    {rightPanelMode === 'commentary' ? (
                        <VerseCommentary />
                    ) : (
                        <VerseDeepDivePanel
                            audioSrc={audioSrc}
                            canGoNext={nextVersePath !== null}
                            canGoPrevious={previousVersePath !== null}
                            onNext={() => {
                                if (nextVersePath) {
                                    navigate(nextVersePath);
                                }
                            }}
                            onPrevious={() => {
                                if (previousVersePath) {
                                    navigate(previousVersePath);
                                }
                            }}
                            verse={verseData}
                            verseLabel={`${currentChapterNumber}.${verseRange}`}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default VerseView;
