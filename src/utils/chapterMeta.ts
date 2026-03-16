import { CHAPTER_DATA } from '../constants';
import { GitaChapter } from '../types';

export interface ResolvedChapterMeta {
    displayTitle: string;
    mainTitle: string;
    subtitle?: string;
    description: string;
}

const splitTitle = (title: string): Pick<ResolvedChapterMeta, 'mainTitle' | 'subtitle'> => {
    const titleMatch = title.match(/^(.*?)\s*\((.*?)\)$/);
    if (!titleMatch) {
        return {
            mainTitle: title
        };
    }

    return {
        mainTitle: titleMatch[1].trim(),
        subtitle: `(${titleMatch[2].trim()})`
    };
};

export const getChapterMeta = (chapter: GitaChapter): ResolvedChapterMeta => {
    const staticMeta = CHAPTER_DATA[chapter.chapter];
    const displayTitle = staticMeta?.name_korean || staticMeta?.name || chapter.name_translated || `Chapter ${chapter.chapter}`;
    const { mainTitle, subtitle } = splitTitle(displayTitle);

    return {
        displayTitle,
        mainTitle,
        subtitle,
        description: staticMeta?.description || 'Read verses of this chapter.'
    };
};
