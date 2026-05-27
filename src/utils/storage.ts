const storageAvailable = (): boolean => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const getStorage = (): Storage | null => {
    if (!storageAvailable()) {
        return null;
    }

    return window.localStorage;
};

export const STORAGE_KEYS = {
    desktopSidebar: 'gita-desktop-sidebar',
    desktopCommentary: 'gita-desktop-commentary',
    showLexicon: 'gita-show-lexicon'
} as const;

const LEGACY_STORAGE_KEYS = {
    desktopCommentary: 'gita-desktop-notes',
    desktopNotes: 'gita-desktop-reflections'
} as const;

export const getString = (key: string): string | null => {
    const storage = getStorage();
    if (!storage) {
        return null;
    }

    try {
        return storage.getItem(key);
    } catch {
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
    } catch {
        return;
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

export const getDesktopCommentaryPreference = (): boolean => {
    const currentValue = getString(STORAGE_KEYS.desktopCommentary);
    if (currentValue !== null) {
        return currentValue === 'true';
    }

    const legacyValue = getString(LEGACY_STORAGE_KEYS.desktopCommentary) ?? getString(LEGACY_STORAGE_KEYS.desktopNotes);
    if (legacyValue !== null) {
        const nextValue = legacyValue === 'true';
        setBoolean(STORAGE_KEYS.desktopCommentary, nextValue);
        return nextValue;
    }

    return true;
};

export const setDesktopCommentaryPreference = (value: boolean): void => {
    setBoolean(STORAGE_KEYS.desktopCommentary, value);
};
