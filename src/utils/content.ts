import { GitaVerse } from '../types';

export interface TranslationDefinition {
    id: 'english' | 'ham' | 'gil' | 'jimong' | 'suk';
    title: 'ENGLISH' | 'HAM' | 'GIL' | 'MYUNG' | 'SUK';
    content: string;
    className: 'font-inter' | 'font-pretendard';
}

export const getTranslationDefinitions = (verse: GitaVerse): TranslationDefinition[] => {
    const definitions: TranslationDefinition[] = [
        { id: 'english', title: 'ENGLISH', content: verse.translation_en ?? '', className: 'font-inter' },
        { id: 'ham', title: 'HAM', content: verse.translation_ham ?? '', className: 'font-pretendard' },
        { id: 'gil', title: 'GIL', content: verse.translation_gil ?? '', className: 'font-pretendard' },
        { id: 'jimong', title: 'MYUNG', content: verse.translation_jimong ?? '', className: 'font-pretendard' },
        { id: 'suk', title: 'SUK', content: verse.translation_suk ?? '', className: 'font-pretendard' }
    ];

    return definitions.filter(definition => definition.content.trim() !== '');
};

export const isDisplayableCommentary = (commentary: string): boolean => (
    commentary !== '' &&
    !commentary.startsWith('$') &&
    !commentary.toLowerCase().startsWith('hindi commentary by ') &&
    !/[\u0900-\u097F]/.test(commentary)
);

export const getSanskritPreview = (sanskrit: string): string => {
    const nonEmptyLines = sanskrit
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean);

    if (nonEmptyLines.length > 1) {
        return nonEmptyLines[1];
    }

    if (nonEmptyLines.length === 1) {
        return nonEmptyLines[0];
    }

    return sanskrit.trim().slice(0, 50);
};
