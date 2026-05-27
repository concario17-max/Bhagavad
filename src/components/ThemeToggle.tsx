import { MoonStar, SunMedium } from 'lucide-react';

import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="inline-flex items-center gap-2 rounded-full border border-gold-primary/15 bg-white/82 px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-text-secondary transition-colors hover:border-gold-primary/35 hover:text-gold-primary dark:border-dark-border/70 dark:bg-dark-surface/80 dark:text-dark-text-secondary dark:hover:text-gold-light"
        >
            {isDark ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
            <span>{isDark ? 'Light' : 'Dark'}</span>
        </button>
    );
};

export default ThemeToggle;
