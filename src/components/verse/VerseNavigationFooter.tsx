import { ChevronLeft, ChevronRight } from 'lucide-react';

interface VerseNavigationFooterProps {
    canGoNext: boolean;
    canGoPrevious: boolean;
    onNext: () => void;
    onPrevious: () => void;
    verseLabel: string;
}

const VerseNavigationFooter = ({
    canGoNext,
    canGoPrevious,
    onNext,
    onPrevious,
    verseLabel
}: VerseNavigationFooterProps) => {
    return (
        <div className="flex items-center justify-between rounded-full border border-gold-primary/15 bg-white/75 px-3 py-1.5 shadow-lg shadow-black/5 backdrop-blur-md transition-shadow hover:shadow-xl dark:border-dark-border/70 dark:bg-dark-surface/75 min-w-[190px]">
            <button
                onClick={onPrevious}
                disabled={!canGoPrevious}
                className="p-2 rounded-full hover:bg-gold-surface/50 dark:hover:bg-[#222] transition-colors disabled:opacity-30 disabled:cursor-not-allowed group text-[#5B7282] dark:text-dark-text-secondary"
            >
                <ChevronLeft className="w-5 h-5 group-hover:scale-110 transition-transform stroke-[1.5]" />
            </button>

            <span className="text-[15px] font-bold text-[#1C2B36] dark:text-dark-text-primary tracking-wide px-4">
                {verseLabel}
            </span>

            <button
                onClick={onNext}
                disabled={!canGoNext}
                className="p-2 rounded-full hover:bg-gold-surface/50 dark:hover:bg-[#222] transition-colors disabled:opacity-30 disabled:cursor-not-allowed group text-[#5B7282] dark:text-dark-text-secondary"
            >
                <ChevronRight className="w-5 h-5 group-hover:scale-110 transition-transform stroke-[1.5]" />
            </button>
        </div>
    );
};

export default VerseNavigationFooter;
