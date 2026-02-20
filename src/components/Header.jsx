import { Link } from 'react-router-dom';
import { Moon, Sun, Languages, User } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Header = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-nisha-bg/80 backdrop-blur-sm transition-colors duration-300">
            <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
                <div className="flex items-center gap-3">
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <span className="font-bold text-xl text-prakash-primary dark:text-nisha-primary transition-colors group-hover:opacity-80">Bhagavad Gita</span>
                    </Link>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                    <button className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors">
                        <Languages className="w-5 h-5" />
                        <span className="hidden sm:inline-block text-sm font-medium">EN</span>
                    </button>
                    <button className="hidden sm:flex items-center gap-2 bg-prakash-primary dark:bg-nisha-primary text-white dark:text-gray-900 px-4 py-2 rounded-md font-medium text-sm hover:opacity-90 transition-opacity">
                        <User className="w-4 h-4" />
                        Sign In
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
