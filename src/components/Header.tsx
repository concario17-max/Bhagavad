import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import ChapterVerseSelector from './ChapterVerseSelector';
import { withBasePath } from '../utils/paths';

interface HeaderProps {
    title?: ReactNode;
    className?: string;
}

const Header = ({
    title = 'Bhagavad Gita',
    className = ''
}: HeaderProps) => {
    return (
        <header className={`sticky top-0 z-50 w-full border-b border-gold-primary/10 dark:border-dark-border/60 bg-white/72 dark:bg-[#070707]/72 backdrop-blur-2xl transition-colors duration-500 shadow-[0_10px_35px_-24px_rgba(0,0,0,0.45)] ${className}`}>
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-3 lg:grid lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center lg:px-6">
                <div className="flex items-center justify-between gap-3">
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

                    <div className="lg:hidden">
                        <ThemeToggle className="border border-gold-primary/15 bg-white/65 dark:border-dark-border/70 dark:bg-dark-surface/70" />
                    </div>
                </div>

                <div className="lg:hidden">
                    <ChapterVerseSelector />
                </div>

                <div className="hidden lg:flex lg:min-w-0 lg:justify-center lg:px-6">
                    <ChapterVerseSelector />
                </div>

                <div className="hidden lg:flex lg:justify-end">
                    <ThemeToggle className="border border-gold-primary/15 bg-white/65 dark:border-dark-border/70 dark:bg-dark-surface/70" />
                </div>
            </div>
        </header>
    );
};

export default Header;
