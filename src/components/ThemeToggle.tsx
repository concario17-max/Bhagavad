import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
    className?: string;
}

/**
 * 전역 테마 토글 컴포넌트
 * 단일 책임 원칙(Zero Monolith) 적용.
 */
const ThemeToggle = ({ className = "" }: ThemeToggleProps) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={`p-2 rounded-full hover:bg-gold-surface dark:hover:bg-dark-surface text-gold-primary transition-all duration-300 ${className}`}
            aria-label="Toggle theme"
            title="테마 변경"
        >
            {theme === 'dark' ? (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5 opacity-80" />
            ) : (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5 opacity-80" />
            )}
        </button>
    );
};

export default ThemeToggle;
