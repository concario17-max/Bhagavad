import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VerseAudioPlayer from '../components/verse/VerseAudioPlayer';
import VerseBreadcrumb from '../components/verse/VerseBreadcrumb';
import VerseLexiconSection from '../components/verse/VerseLexiconSection';
import VerseMessageState from '../components/verse/VerseMessageState';
import VerseNavigationFooter from '../components/verse/VerseNavigationFooter';
import VersePrimaryCard from '../components/verse/VersePrimaryCard';
import VerseTranslationsSection from '../components/verse/VerseTranslationsSection';
import VerseCommentary from '../components/VerseCommentary';
import { ContentReader } from '../components/ui/ContentReader';
import { useVerseData } from '../context/VerseDataContext';
import { getTranslationDefinitions } from '../utils/content';
import { withBasePath } from '../utils/paths';
import { getNextVersePath, getPreviousVersePath } from '../utils/verse';

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

    useEffect(() => {
        if (!resolvedVerseNumber || resolvedVerseNumber === requestedVerseNumber) {
            return;
        }

        navigate(`/chapter/${chapterNum}/verse/${resolvedVerseNumber}`, { replace: true });
    }, [chapterNum, navigate, requestedVerseNumber, resolvedVerseNumber]);

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

    const audioFilename = verseData.audio?.split('/').pop();
    const audioSrc = audioFilename ? withBasePath(`mp3/${audioFilename}`) : undefined;
    const previousVersePath = getPreviousVersePath(allChapters, chapterNum, verseData);
    const nextVersePath = getNextVersePath(allChapters, chapterNum, verseData);
    const translationSections = getTranslationDefinitions(verseData);

    return (
        <div className="mx-auto w-full max-w-[1840px] px-3 py-6 sm:px-5 lg:px-6 lg:py-8">
            <div className="grid gap-8 lg:grid-cols-2">
                <div className="min-w-0 space-y-6">
                    <VerseBreadcrumb chapterNum={chapterNum} verseRange={verseRange} />
                    <VersePrimaryCard verse={verseData} />
                    <VerseAudioPlayer audioSrc={audioSrc} />
                    <VerseLexiconSection words={verseData.words} />
                    <VerseTranslationsSection sections={translationSections} />
                    <VerseNavigationFooter
                        canGoPrevious={previousVersePath !== null}
                        canGoNext={nextVersePath !== null}
                        onPrevious={() => {
                            if (previousVersePath) {
                                navigate(previousVersePath);
                            }
                        }}
                        onNext={() => {
                            if (nextVersePath) {
                                navigate(nextVersePath);
                            }
                        }}
                        verseLabel={`${currentChapterNumber}.${verseRange}`}
                    />
                </div>

                <div className="min-w-0">
                    <VerseCommentary />
                </div>
            </div>
        </div>
    );
};

export default VerseView;
