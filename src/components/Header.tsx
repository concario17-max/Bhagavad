import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import ChapterVerseSelector from './ChapterVerseSelector';
import { useUI } from '../context/UIContext';
import { withBasePath } from '../utils/paths';

interface HeaderProps {
    title?: ReactNode;
    className?: string;
}

const Header = ({
    title = 'Bhagavad Gita',
    className = ''
}: HeaderProps) => {
    const { rightPanelMode, toggleRightPanelMode } = useUI();
    const isDeepDive = rightPanelMode === 'deep-dive';

    const brand = (
        <Link to="/" className="flex items-center gap-3 tracking-widest text-text-primary dark:text-dark-text-primary">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-surface/80 ring-1 ring-gold-primary/10 transition-transform dark:bg-dark-surface/80 dark:ring-dark-border/70">
                <img
                    src={withBasePath('gita_header_icon.png')}
                    alt=""
                    className="h-6 w-6 object-contain opacity-90"
                />
            </span>
            <span className="flex flex-col leading-none">
                <span className="font-bold text-base sm:text-[17px] transition-colors font-crimson uppercase tracking-[0.18em]">
                    {title}
                </span>
            </span>
        </Link>
    );

    const modeToggle = (
        <button
            type="button"
            onClick={toggleRightPanelMode}
            aria-pressed={isDeepDive}
            title={isDeepDive ? 'Switch to commentary' : 'Switch to deep-dive'}
            className="inline-flex items-center rounded-full border border-gold-primary/20 bg-white/80 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-text-secondary transition-colors hover:border-gold-primary/40 hover:text-gold-primary aria-pressed:border-gold-primary/45 aria-pressed:bg-gold-surface/90 aria-pressed:text-gold-primary dark:border-dark-border/70 dark:bg-dark-bg/50 dark:text-dark-text-secondary dark:hover:text-gold-light dark:aria-pressed:border-gold-light/40 dark:aria-pressed:bg-dark-surface/90 dark:aria-pressed:text-gold-light"
        >
            {isDeepDive ? '심화' : 'Commentary'}
        </button>
    );

    return (
        <header className={`sticky top-0 z-50 w-full border-b border-gold-primary/10 dark:border-dark-border/60 bg-white/72 dark:bg-[#070707]/72 backdrop-blur-2xl transition-colors duration-500 shadow-[0_10px_35px_-24px_rgba(0,0,0,0.45)] ${className}`}>
            <div className="mx-auto w-full max-w-7xl px-4 py-3 lg:px-6">
                <div className="flex items-center justify-between gap-3 lg:hidden">
                    {brand}
                    {modeToggle}
                </div>

                <div className="mt-3 flex justify-center lg:hidden">
                    <ChapterVerseSelector />
                </div>

                <div className="hidden lg:grid lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center lg:gap-6">
                    {brand}

                    <div className="flex min-w-0 justify-center px-6">
                        <ChapterVerseSelector />
                    </div>

                    <div className="flex justify-end">
                        {modeToggle}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
