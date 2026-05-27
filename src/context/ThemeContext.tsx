import { createContext, useContext, useEffect, useMemo, useState, ReactNode, useCallback } from 'react';

import { STORAGE_KEYS, getString, setString } from '../utils/storage';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
    theme: ThemeMode;
    toggleTheme: () => void;
    setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
}

const getInitialTheme = (): ThemeMode => {
    const storedTheme = getString(STORAGE_KEYS.theme);
    if (storedTheme === 'light' || storedTheme === 'dark') {
        return storedTheme;
    }

    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }

    return 'light';
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const [theme, setThemeState] = useState<ThemeMode>(getInitialTheme);

    useEffect(() => {
        const root = document.documentElement;
        root.classList.toggle('dark', theme === 'dark');
        root.dataset.theme = theme;
        root.style.colorScheme = theme;
        setString(STORAGE_KEYS.theme, theme);
    }, [theme]);

    const setTheme = useCallback((nextTheme: ThemeMode) => {
        setThemeState(nextTheme);
    }, []);

    const toggleTheme = useCallback(() => {
        setThemeState(previous => (previous === 'dark' ? 'light' : 'dark'));
    }, []);

    const value = useMemo<ThemeContextType>(() => ({
        theme,
        toggleTheme,
        setTheme
    }), [setTheme, theme, toggleTheme]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
