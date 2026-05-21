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
    const { rightPanelMode, setRightPanelMode } = useUI();
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
        <div className="inline-flex items-stretch border-l border-gold-primary/12 dark:border-dark-border/70">
            <button
                type="button"
                onClick={() => setRightPanelMode('commentary')}
                aria-pressed={!isDeepDive}
                title="Switch to commentary"
                className={`inline-flex items-center justify-center px-3.5 py-2.5 text-[11px] font-bold uppercase tracking-[0.18em] transition-colors sm:px-4 ${
                    !isDeepDive
                        ? 'bg-gold-primary text-white dark:bg-gold-light dark:text-[#1C2B36]'
                        : 'bg-white/80 text-text-secondary hover:text-gold-primary dark:bg-dark-bg/40 dark:text-dark-text-secondary dark:hover:text-gold-light'
                }`}
            >
                Commentary
            </button>
            <button
                type="button"
                onClick={() => setRightPanelMode('deep-dive')}
                aria-pressed={isDeepDive}
                title="Switch to text"
                className={`inline-flex items-center justify-center px-3.5 py-2.5 text-[11px] font-bold uppercase tracking-[0.18em] transition-colors sm:px-4 ${
                    isDeepDive
                        ? 'bg-gold-primary text-white dark:bg-gold-light dark:text-[#1C2B36]'
                        : 'bg-white/80 text-text-secondary hover:text-gold-primary dark:bg-dark-bg/40 dark:text-dark-text-secondary dark:hover:text-gold-light'
                }`}
            >
                Text
            </button>
        </div>
    );

    return (
        <header className={`sticky top-0 z-50 w-full border-b border-gold-primary/10 bg-white/72 shadow-[0_10px_35px_-24px_rgba(0,0,0,0.45)] backdrop-blur-2xl transition-colors duration-500 dark:border-dark-border/60 dark:bg-[#070707]/72 ${className}`}>
            <div className="mx-auto w-full max-w-7xl px-4 py-3 lg:px-6">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center justify-between gap-3 lg:min-w-0">
                        {brand}
                    </div>

                    <div className="w-full lg:w-auto">
                        <div className="overflow-hidden rounded-[28px] border border-gold-primary/12 bg-white/90 shadow-[0_20px_60px_-36px_rgba(78,56,22,0.42)] backdrop-blur-xl dark:border-dark-border/70 dark:bg-dark-surface/88">
                            <div className="flex min-w-0 items-stretch">
                                <div className="min-w-0 flex-1">
                                    <ChapterVerseSelector />
                                </div>
                                {modeToggle}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
