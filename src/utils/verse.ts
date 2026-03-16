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
