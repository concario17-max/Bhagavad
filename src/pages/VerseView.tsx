import { useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VerseCommentary from '../components/VerseCommentary';
import VerseDeepDivePanel from '../components/verse/VerseDeepDivePanel';
import VerseMessageState from '../components/verse/VerseMessageState';
import VerseTranslationsSection from '../components/verse/VerseTranslationsSection';
import { ContentReader } from '../components/ui/ContentReader';
import { useUI } from '../context/UIContext';
import { useVerseData } from '../context/VerseDataContext';
import { getDeepDiveTranslationDefinitions, getLeftTranslationDefinitions } from '../utils/content';
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
            <ContentReader maxWidth="max-w-[52rem]">
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
    const leftTranslationSections = getLeftTranslationDefinitions(verseData);
    const deepDiveTranslationSections = getDeepDiveTranslationDefinitions(verseData);
    const isCommentaryMode = rightPanelMode === 'commentary';

    return (
        <div className="mx-auto flex h-full min-h-0 w-full max-w-[52rem] flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8">
            <div className="w-full min-w-0">
                <VerseTranslationsSection sections={leftTranslationSections} />
            </div>

            <div className="w-full min-w-0">
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
                        translationSections={deepDiveTranslationSections}
                        verse={verseData}
                        verseLabel={`${currentChapterNumber}.${verseRange}`}
                    />
                )}
            </div>
        </div>
    );
};

export default VerseView;
