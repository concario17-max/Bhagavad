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
        <div className="flex items-center justify-between rounded-full border border-gold-primary/15 bg-white/75 px-2.5 py-1.5 shadow-lg shadow-black/5 backdrop-blur-md transition-shadow hover:shadow-xl dark:border-dark-border/70 dark:bg-dark-surface/75 min-w-[168px] sm:px-3">
            <button
                onClick={onPrevious}
                disabled={!canGoPrevious}
                className="rounded-full p-1.5 text-[#5B7282] transition-colors hover:bg-gold-surface/50 group disabled:cursor-not-allowed disabled:opacity-30 dark:text-dark-text-secondary dark:hover:bg-[#222]"
            >
                <ChevronLeft className="h-4.5 w-4.5 stroke-[1.5] transition-transform group-hover:scale-110" />
            </button>

            <span className="px-2 text-[15px] font-bold tracking-wide text-[#1C2B36] dark:text-dark-text-primary">
                {verseLabel}
            </span>

            <button
                onClick={onNext}
                disabled={!canGoNext}
                className="rounded-full p-1.5 text-[#5B7282] transition-colors hover:bg-gold-surface/50 group disabled:cursor-not-allowed disabled:opacity-30 dark:text-dark-text-secondary dark:hover:bg-[#222]"
            >
                <ChevronRight className="h-4.5 w-4.5 stroke-[1.5] transition-transform group-hover:scale-110" />
            </button>
        </div>
    );
};

export default VerseNavigationFooter;
