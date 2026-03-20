import { Link } from 'react-router-dom';

interface VerseBreadcrumbProps {
    chapterNum: string;
    verseRange: string;
}

const VerseBreadcrumb = ({ chapterNum, verseRange }: VerseBreadcrumbProps) => {
    return (
        <div className="w-full">
            <nav className="mb-4 flex items-center gap-2 text-[12px] font-inter uppercase tracking-[0.18em] text-text-secondary/70 dark:text-dark-text-secondary/70">
                <Link to="/" className="hover:text-gold-primary dark:hover:text-gold-light transition-colors">Home</Link>
                <span>/</span>
                <span className="font-bold text-text-primary dark:text-dark-text-primary">Chapter {chapterNum}, Verse {verseRange}</span>
            </nav>
        </div>
    );
};

export default VerseBreadcrumb;
