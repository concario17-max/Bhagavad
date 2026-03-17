import type { VersePanelMode } from '../context/UIContext';

const storageAvailable = (): boolean => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const getStorage = (): Storage | null => {
    if (!storageAvailable()) {
        return null;
    }

    return window.localStorage;
};

export const STORAGE_KEYS = {
    authenticated: 'gita_authenticated',
    theme: 'theme',
    activeVersePanel: 'gita-active-verse-panel',
    desktopSidebar: 'gita-desktop-sidebar',
    desktopReflections: 'gita-desktop-reflections',
    showLexicon: 'gita-show-lexicon'
} as const;

const NOTE_PREFIX = 'gita-note-';

export interface StoredReflectionNote {
    key: string;
    chapter: string;
    verse: string;
    content: string;
}

export const getString = (key: string): string | null => {
    const storage = getStorage();
    if (!storage) {
        return null;
    }

    try {
        return storage.getItem(key);
    } catch (error) {
        console.warn(`Unable to read localStorage key "${key}":`, error);
        return null;
    }
};

export const setString = (key: string, value: string): void => {
    const storage = getStorage();
    if (!storage) {
        return;
    }

    try {
        storage.setItem(key, value);
    } catch (error) {
        console.warn(`Unable to write localStorage key "${key}":`, error);
    }
};

export const getBoolean = (key: string, fallback: boolean): boolean => {
    const rawValue = getString(key);
    if (rawValue === null) {
        return fallback;
    }

    return rawValue === 'true';
};

export const setBoolean = (key: string, value: boolean): void => {
    setString(key, value ? 'true' : 'false');
};

export const getThemePreference = (): 'light' | 'dark' => {
    const savedTheme = getString(STORAGE_KEYS.theme);
    return savedTheme === 'dark' ? 'dark' : 'light';
};

export const setThemePreference = (theme: 'light' | 'dark'): void => {
    setString(STORAGE_KEYS.theme, theme);
};

export const getActiveVersePanel = (): VersePanelMode => {
    const savedPanel = getString(STORAGE_KEYS.activeVersePanel);
    return savedPanel === 'notes' ? 'notes' : 'commentary';
};

export const setActiveVersePanelPreference = (panel: VersePanelMode): void => {
    setString(STORAGE_KEYS.activeVersePanel, panel);
};

export const getReflectionNoteKey = (chapterNum: string, verseNum: string): string => `${NOTE_PREFIX}${chapterNum}-${verseNum}`;

export const getReflectionNote = (chapterNum: string, verseNum: string): string => getString(getReflectionNoteKey(chapterNum, verseNum)) ?? '';

export const setReflectionNote = (chapterNum: string, verseNum: string, note: string): void => {
    setString(getReflectionNoteKey(chapterNum, verseNum), note);
};

export const getAllReflectionNotes = (): StoredReflectionNote[] => {
    const storage = getStorage();
    if (!storage) {
        return [];
    }

    const notes: StoredReflectionNote[] = [];

    try {
        for (let index = 0; index < storage.length; index += 1) {
            const key = storage.key(index);
            if (!key || !key.startsWith(NOTE_PREFIX)) {
                continue;
            }

            const [, , chapter, verse] = key.split('-');
            const content = storage.getItem(key);
            if (!chapter || !verse || !content || !content.trim()) {
                continue;
            }

            notes.push({
                key,
                chapter,
                verse,
                content: content.trim()
            });
        }
    } catch (error) {
        console.warn('Unable to read reflection notes from localStorage:', error);
        return [];
    }

    notes.sort((left, right) => {
        const chapterDifference = Number.parseInt(left.chapter, 10) - Number.parseInt(right.chapter, 10);
        if (chapterDifference !== 0) {
            return chapterDifference;
        }

        return Number.parseInt(left.verse, 10) - Number.parseInt(right.verse, 10);
    });

    return notes;
};
