import { useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VerseCommentary from '../components/VerseCommentary';
import VerseDeepDivePanel from '../components/verse/VerseDeepDivePanel';
import VerseMessageState from '../components/verse/VerseMessageState';
import VerseTranslationsSection from '../components/verse/VerseTranslationsSection';
import { ContentReader } from '../components/ui/ContentReader';
import { useUI } from '../context/UIContext';
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
    const { rightPanelMode, setRightPanelMode } = useUI();

    useEffect(() => {
        if (!resolvedVerseNumber || resolvedVerseNumber === requestedVerseNumber) {
            return;
        }

        navigate(`/chapter/${chapterNum}/verse/${resolvedVerseNumber}`, { replace: true });
    }, [chapterNum, navigate, requestedVerseNumber, resolvedVerseNumber]);

    useLayoutEffect(() => {
        if (typeof window === 'undefined' || !chapterNum || !verseRange) {
            return;
        }

        const savedMode = window.localStorage.getItem(getRightPanelStorageKey(chapterNum, verseRange));
        if (savedMode === 'commentary' || savedMode === 'deep-dive') {
            setRightPanelMode(savedMode as RightPanelMode);
            return;
        }

        setRightPanelMode('commentary');
    }, [chapterNum, setRightPanelMode, verseRange]);

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
    const isCommentaryMode = rightPanelMode === 'commentary';

    return (
        <div className="mx-auto h-full min-h-0 w-full max-w-[1840px] px-3 py-6 sm:px-5 lg:px-6 lg:py-4 lg:overflow-hidden">
            <div className="flex min-h-0 w-full flex-col gap-8 lg:grid lg:h-full lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-6">
                <div className="min-w-0 lg:min-h-0 lg:overflow-y-auto lg:pr-2">
                    <VerseTranslationsSection sections={translationSections} />
                </div>

                <div className="min-w-0 lg:min-h-0 lg:overflow-y-auto lg:pl-2">
                    {isCommentaryMode ? (
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
