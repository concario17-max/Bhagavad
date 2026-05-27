import { useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import VerseMessageState from '../components/verse/VerseMessageState';
import VersePrimaryCard from '../components/verse/VersePrimaryCard';
import VerseTranslationsSection from '../components/verse/VerseTranslationsSection';
import { ContentReader } from '../components/ui/ContentReader';
import { useVerseData } from '../context/VerseDataContext';
import { getLeftTranslationDefinitions } from '../utils/content';
import { scrollAppContainerToTop } from '../utils/paths';

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

    useLayoutEffect(() => {
        scrollAppContainerToTop();
    }, [chapterNum, verseRange]);

    if (status === 'loading') {
        return (
            <ContentReader maxWidth="max-w-[1120px]">
                <div className="flex min-h-[60vh] items-center justify-center">
                    <div className="w-full max-w-2xl rounded-[34px] border border-gold-primary/14 bg-white/72 px-6 py-12 text-center shadow-[0_20px_80px_-52px_rgba(78,56,22,0.48)] backdrop-blur-xl dark:border-dark-border/70 dark:bg-dark-surface/72 sm:px-10">
                        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gold-primary border-t-transparent" />
                        <p className="mt-6 font-crimson text-3xl font-light tracking-[0.08em] text-text-primary dark:text-dark-text-primary">
                            Loading verse
                        </p>
                        <p className="mt-4 text-[15px] leading-8 text-text-secondary dark:text-dark-text-secondary">
                            Preparing the chapter and commentary panels.
                        </p>
                    </div>
                </div>
            </ContentReader>
        );
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

    const leftTranslationSections = getLeftTranslationDefinitions(verseData);

    return (
        <div className="mx-auto w-full max-w-[1120px] px-4 py-6 transition-colors duration-500 sm:px-6 lg:px-8 lg:py-6">
            <div className="mb-5 space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-gold-primary/70 dark:text-gold-light/70">
                    Chapter {currentChapterNumber}
                </p>
                <h1 className="font-crimson text-2xl font-light tracking-[0.08em] text-text-primary dark:text-dark-text-primary sm:text-3xl">
                    Verse {verseRange}
                </h1>
            </div>

            <div className="space-y-6">
                <VersePrimaryCard verse={verseData} />
                <VerseTranslationsSection sections={leftTranslationSections} />
            </div>
        </div>
    );
};

export default VerseView;
