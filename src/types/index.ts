export interface VerseWord {
    s: string; // sanskrit word
    m: string; // meaning
}

export interface GitaVerse {
    id: string;
    chapter: number;
    verse: number;
    sanskrit: string;
    iast: string;
    korean_pronunciation?: string;
    audio?: string;
    words?: VerseWord[];
    translation_en?: string;
    translation_ham?: string;
    translation_gil?: string;
    translation_jimong?: string;
    translation_suk?: string;
    commentary_en?: string;
}

export interface GitaChapter {
    chapter: number;
    verses: GitaVerse[];
    name_translated?: string;
}

export type GitaData = Record<string, GitaChapter>;
