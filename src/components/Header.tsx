import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useUI } from '../context/UIContext';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
    title?: ReactNode;
    targetUrl?: string;
    showSidebarToggle?: boolean;
    rightContent?: ReactNode;
    className?: string;
}

const Header = ({
    title = "Default Title",
    targetUrl = "/",
    showSidebarToggle = false,
    rightContent,
    className = ""
}: HeaderProps) => {
    const { toggleSidebar } = useUI();

    return (
        <header className={`sticky top-0 z-50 w-full border-b border-gold-primary/20 dark:border-dark-border/60 bg-white/60 dark:bg-[#070707]/60 backdrop-blur-xl transition-colors duration-500 shadow-sm ${className}`}>
            <div className={`container mx-auto flex h-16 items-center px-4 justify-between max-w-7xl`}>

                {/* Left Side: Logo / Title */}
                <div className="flex items-center gap-2 sm:gap-4 tracking-widest text-text-primary dark:text-dark-text-primary">
                    {showSidebarToggle && (
                        <button
                            onClick={toggleSidebar}
                            className="p-2 -ml-2 rounded-lg hover:bg-gold-surface dark:hover:bg-dark-surface text-gold-primary dark:text-gold-light transition-colors"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    )}
                    <Link to={targetUrl} className="flex items-center gap-2.5 group">
                        <span className="text-xl font-serif text-gold-primary leading-none opacity-80 group-hover:scale-110 transition-transform">֍</span>
                        <span className="font-bold text-lg transition-colors font-crimson uppercase">
                            {title}
                        </span>
                    </Link>
                </div>

                {/* Right Side: Dynamic Content & Theme Toggle */}
                <div className="flex items-center gap-3">
                    {rightContent}
                    <ThemeToggle className="ml-2" />
                </div>
            </div>
        </header>
    );
};

export default Header;
