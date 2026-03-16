import { MessageSquareText, NotebookPen } from 'lucide-react';
import { useUI } from '../context/UIContext';

const VersePanelToggle = () => {
    const { activeVersePanel, setActiveVersePanel, toggleReflections } = useUI();

    const handleToggle = (): void => {
        const nextPanel = activeVersePanel === 'notes' ? 'commentary' : 'notes';
        setActiveVersePanel(nextPanel);
        toggleReflections(true);
    };

    const isNotesPanel = activeVersePanel === 'notes';

    return (
        <button
            type="button"
            onClick={handleToggle}
            className="inline-flex items-center gap-2 rounded-full border border-gold-primary/15 bg-white/72 px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-text-secondary transition-colors hover:border-gold-primary/40 hover:bg-white hover:text-gold-primary dark:border-dark-border/70 dark:bg-dark-surface/72 dark:text-dark-text-secondary dark:hover:bg-dark-surface dark:hover:text-gold-light"
            aria-label={`Switch to ${isNotesPanel ? 'commentary' : 'notes'} panel`}
            title={`Show ${isNotesPanel ? 'commentary' : 'notes'} panel`}
        >
            {isNotesPanel ? <MessageSquareText className="h-4 w-4" /> : <NotebookPen className="h-4 w-4" />}
            <span>{isNotesPanel ? 'Commentary' : 'Notes'}</span>
        </button>
    );
};

export default VersePanelToggle;
