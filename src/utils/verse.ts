import { GitaChapter, GitaData, GitaVerse } from '../types';

const findResolvedVerseIndex = (chapter: GitaChapter, verseNum: string): number => {
    const targetVerseNumber = Number.parseInt(verseNum, 10);

    return chapter.verses.findIndex((verse, index, verses) => {
        const nextVerse = verses[index + 1];
        if (nextVerse) {
            return verse.verse <= targetVerseNumber && targetVerseNumber < nextVerse.verse;
        }

        return verse.verse <= targetVerseNumber;
    });
};

export const resolveVerse = (data: GitaData, chapterNum: string, verseNum: string): GitaVerse | null => {
    const chapter = data[chapterNum];
    if (!chapter) {
        return null;
    }

    const verseIndex = findResolvedVerseIndex(chapter, verseNum);
    return verseIndex === -1 ? null : chapter.verses[verseIndex];
};

export const getVerseRange = (chapter: GitaChapter, verse: GitaVerse): string => {
    const currentIndex = chapter.verses.findIndex(entry => entry.verse === verse.verse);
    if (currentIndex === -1) {
        return verse.verse.toString();
    }

    const nextVerse = chapter.verses[currentIndex + 1];
    if (nextVerse && nextVerse.verse > verse.verse + 1) {
        return `${verse.verse}-${nextVerse.verse - 1}`;
    }

    return verse.verse.toString();
};

const buildVersePath = (chapterNumber: number, verseNumber: number): string => `/chapter/${chapterNumber}/verse/${verseNumber}`;

export const getPreviousVersePath = (data: GitaData, chapterNum: string, verse: GitaVerse): string | null => {
    const currentChapterNumber = Number.parseInt(chapterNum, 10);
    const currentChapter = data[currentChapterNumber.toString()];

    if (!currentChapter) {
        return null;
    }

    const currentIndex = currentChapter.verses.findIndex(entry => entry.verse === verse.verse);
    if (currentIndex === -1) {
        return null;
    }

    if (currentIndex > 0) {
        return buildVersePath(currentChapterNumber, currentChapter.verses[currentIndex - 1].verse);
    }

    if (currentChapterNumber <= 1) {
        return null;
    }

    const previousChapter = data[(currentChapterNumber - 1).toString()];
    if (!previousChapter || previousChapter.verses.length === 0) {
        return null;
    }

    return buildVersePath(currentChapterNumber - 1, previousChapter.verses[previousChapter.verses.length - 1].verse);
};

export const getNextVersePath = (data: GitaData, chapterNum: string, verse: GitaVerse): string | null => {
    const currentChapterNumber = Number.parseInt(chapterNum, 10);
    const currentChapter = data[currentChapterNumber.toString()];

    if (!currentChapter) {
        return null;
    }

    const currentIndex = currentChapter.verses.findIndex(entry => entry.verse === verse.verse);
    if (currentIndex === -1) {
        return null;
    }

    if (currentIndex < currentChapter.verses.length - 1) {
        return buildVersePath(currentChapterNumber, currentChapter.verses[currentIndex + 1].verse);
    }

    const nextChapter = data[(currentChapterNumber + 1).toString()];
    if (!nextChapter || nextChapter.verses.length === 0) {
        return null;
    }

    return buildVersePath(currentChapterNumber + 1, nextChapter.verses[0].verse);
};
