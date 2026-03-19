import { MessageSquareText } from 'lucide-react';
import { useUI } from '../context/UIContext';

const VersePanelToggle = () => {
    const { isCommentaryPanelOpen, isDesktopCommentaryPanelOpen, toggleCommentaryPanel } = useUI();
    const isPanelOpen = typeof window !== 'undefined' && window.innerWidth < 1024
        ? isCommentaryPanelOpen
        : isDesktopCommentaryPanelOpen;

    return (
        <button
            type="button"
            onClick={() => toggleCommentaryPanel()}
            className="inline-flex items-center gap-2 rounded-full border border-gold-primary/15 bg-white/72 px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-text-secondary transition-colors hover:border-gold-primary/40 hover:bg-white hover:text-gold-primary dark:border-dark-border/70 dark:bg-dark-surface/72 dark:text-dark-text-secondary dark:hover:bg-dark-surface dark:hover:text-gold-light"
            aria-label={`${isPanelOpen ? 'Hide' : 'Show'} commentary panel`}
            title={`${isPanelOpen ? 'Hide' : 'Show'} commentary panel`}
        >
            <MessageSquareText className="h-4 w-4" />
            <span>Commentary</span>
        </button>
    );
};

export default VersePanelToggle;
