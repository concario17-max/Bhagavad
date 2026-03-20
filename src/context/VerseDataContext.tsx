import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { isDisplayableCommentary } from '../utils/content';
import { fetchGitaData } from '../utils/dataFetcher';
import { getVerseRange, resolveVerse } from '../utils/verse';
import { GitaChapter, GitaData, GitaVerse } from '../types';

export type VerseDataStatus = 'loading' | 'ready' | 'not_found' | 'error';

interface VerseDataContextType {
    allChapters: GitaData | null;
    chapterNum: string;
    currentChapter: GitaChapter | null;
    currentChapterNumber: number;
    errorMessage: string | null;
    hasDisplayableCommentary: boolean;
    requestedVerseNumber: number;
    resolvedVerseNumber: number | null;
    status: VerseDataStatus;
    verseData: GitaVerse | null;
    verseNum: string;
    verseRange: string;
}

interface VerseDataProviderProps {
    chapterNum: string;
    verseNum: string;
    children: ReactNode;
}

const VerseDataContext = createContext<VerseDataContextType | undefined>(undefined);

export const VerseDataProvider = ({ chapterNum, verseNum, children }: VerseDataProviderProps) => {
    const [allChapters, setAllChapters] = useState<GitaData | null>(null);
    const [status, setStatus] = useState<VerseDataStatus>('loading');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        setStatus('loading');
        setErrorMessage(null);

        fetchGitaData()
            .then(data => {
                if (cancelled) {
                    return;
                }

                const currentChapter = data[chapterNum];
                const resolvedVerse = resolveVerse(data, chapterNum, verseNum);

                setAllChapters(data);

                if (!currentChapter) {
                    setStatus('not_found');
                    setErrorMessage(`Chapter ${chapterNum} could not be found in the current source data.`);
                    return;
                }

                if (!resolvedVerse) {
                    setStatus('not_found');
                    setErrorMessage(`Verse ${verseNum} could not be found in Chapter ${chapterNum}.`);
                    return;
                }

                setStatus('ready');
            })
            .catch(() => {
                if (cancelled) {
                    return;
                }

                setAllChapters(null);
                setStatus('error');
                setErrorMessage('Verse data could not be loaded from the local source files.');
            });

        return () => {
            cancelled = true;
        };
    }, [chapterNum, verseNum]);

    const value = useMemo<VerseDataContextType>(() => {
        const currentChapter = allChapters?.[chapterNum] ?? null;
        const verseData = allChapters ? resolveVerse(allChapters, chapterNum, verseNum) : null;
        const verseRange = currentChapter && verseData ? getVerseRange(currentChapter, verseData) : '';
        const commentary = verseData?.commentary_en?.trim() ?? '';

        return {
            allChapters,
            chapterNum,
            currentChapter,
            currentChapterNumber: Number.parseInt(chapterNum, 10),
            errorMessage,
            hasDisplayableCommentary: isDisplayableCommentary(commentary),
            requestedVerseNumber: Number.parseInt(verseNum, 10),
            resolvedVerseNumber: verseData?.verse ?? null,
            status,
            verseData,
            verseNum,
            verseRange
        };
    }, [allChapters, chapterNum, errorMessage, status, verseNum]);

    return (
        <VerseDataContext.Provider value={value}>
            {children}
        </VerseDataContext.Provider>
    );
};

export const useVerseData = (): VerseDataContextType => {
    const context = useContext(VerseDataContext);
    if (context === undefined) {
        throw new Error('useVerseData must be used within a VerseDataProvider');
    }
    return context;
};
