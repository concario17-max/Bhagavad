import { CSSProperties, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useUI } from '../context/UIContext';
import ThemeToggle from './ThemeToggle';
import { DESKTOP_VERSE_COLUMNS_DEFAULT } from './ui/desktopVerseLayout';

interface HeaderProps {
    title?: ReactNode;
    targetUrl?: string;
    showSidebarToggle?: boolean;
    rightContent?: ReactNode;
    className?: string;
}

const Header = ({
    title = 'Bhagavad Gita',
    targetUrl = '/',
    showSidebarToggle = true,
    rightContent,
    className = ''
}: HeaderProps) => {
    const { toggleSidebar } = useUI();
    const desktopGridStyle = showSidebarToggle
        ? ({ '--desktop-verse-columns': DESKTOP_VERSE_COLUMNS_DEFAULT } as CSSProperties)
        : undefined;

    const headerContent = (
        <div className="flex h-[72px] items-center justify-between px-4 lg:px-6">
            <div className="flex items-center gap-2 sm:gap-4 tracking-widest text-text-primary dark:text-dark-text-primary">
                {showSidebarToggle && (
                    <button
                        onClick={toggleSidebar}
                        className="p-2 -ml-2 rounded-full border border-transparent hover:border-gold-primary/20 hover:bg-white/70 dark:hover:border-dark-border/80 dark:hover:bg-dark-surface/70 text-gold-primary dark:text-gold-light transition-colors"
                        aria-label="Toggle chapter navigation"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                )}
                <Link to={targetUrl} className="flex items-center gap-3 group">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-surface/80 text-xl font-serif text-gold-primary leading-none opacity-90 ring-1 ring-gold-primary/10 transition-transform group-hover:scale-105 dark:bg-dark-surface/80 dark:ring-dark-border/70">
                        ॐ
                    </span>
                    <span className="flex flex-col leading-none">
                        <span className="text-[10px] font-inter uppercase tracking-[0.3em] text-text-secondary/70 dark:text-dark-text-secondary/70">
                            Reading Room
                        </span>
                        <span className="font-bold text-base sm:text-[17px] transition-colors font-crimson uppercase tracking-[0.18em]">
                            {title}
                        </span>
                    </span>
                </Link>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
                {rightContent}
                <ThemeToggle className="ml-1 border border-gold-primary/15 bg-white/65 dark:border-dark-border/70 dark:bg-dark-surface/70" />
            </div>
        </div>
    );

    return (
        <header className={`sticky top-0 z-50 w-full border-b border-gold-primary/10 dark:border-dark-border/60 bg-white/72 dark:bg-[#070707]/72 backdrop-blur-2xl transition-colors duration-500 shadow-[0_10px_35px_-24px_rgba(0,0,0,0.45)] ${className}`}>
            <div className="lg:hidden">
                {headerContent}
            </div>
            <div
                className={`hidden w-full lg:grid ${showSidebarToggle ? 'lg:[grid-template-columns:var(--desktop-verse-columns)]' : 'lg:grid-cols-1'}`}
                style={desktopGridStyle}
            >
                <div className="min-w-0 lg:col-start-2">
                    {headerContent}
                </div>
            </div>
        </header>
    );
};

export default Header;
