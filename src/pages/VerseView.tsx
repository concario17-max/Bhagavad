import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VerseCommentary from '../components/VerseCommentary';
import VerseMessageState from '../components/verse/VerseMessageState';
import { ContentReader } from '../components/ui/ContentReader';
import { useVerseData } from '../context/VerseDataContext';

const VerseView = () => {
    const navigate = useNavigate();
    const {
        allChapters,
        chapterNum,
        currentChapter,
        errorMessage,
        requestedVerseNumber,
        resolvedVerseNumber,
        status,
        verseData
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

    return (
        <div className="mx-auto h-full min-h-0 w-full max-w-[1280px] px-3 py-6 sm:px-5 lg:px-6 lg:py-6">
            <div className="flex min-h-0 w-full justify-center">
                <div className="w-full max-w-[920px]">
                    <VerseCommentary />
                </div>
            </div>
        </div>
    );
};

export default VerseView;
