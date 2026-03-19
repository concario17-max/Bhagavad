import { X } from 'lucide-react';
import { useUI } from '../context/UIContext';
import VerseCommentary from './VerseCommentary';

const VerseSidePanel = () => {
    const {
        isCommentaryPanelOpen,
        setIsCommentaryPanelOpen,
        isDesktopCommentaryPanelOpen,
        isDesktopSidebarOpen
    } = useUI();

    const mobileWidthClass = 'w-[94vw]';
    const desktopWidthClass = isDesktopSidebarOpen ? 'lg:w-[400px]' : 'lg:w-[800px]';

    return (
        <>
            {isCommentaryPanelOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity duration-300"
                    onClick={() => setIsCommentaryPanelOpen(false)}
                />
            )}

            <aside
                className={`fixed inset-y-0 right-0 z-50 ${mobileWidthClass} bg-white/50 dark:bg-[#101010]/82 backdrop-blur-xl border-l border-gold-primary/14 dark:border-dark-border/70 h-full lg:h-[calc(100vh-72px)] lg:sticky lg:top-[72px] transform transition-all duration-300 flex flex-col font-inter
                    ${isCommentaryPanelOpen ? 'translate-x-0 overflow-hidden shadow-2xl lg:shadow-none' : 'translate-x-full lg:translate-x-0'}
                    ${isDesktopCommentaryPanelOpen ? `${desktopWidthClass} lg:opacity-100` : 'lg:w-0 lg:opacity-0 lg:border-none lg:translate-x-10 px-0 overflow-hidden'}
                `}
            >
                <div className="lg:hidden absolute top-4 right-4 z-50">
                    <button
                        type="button"
                        onClick={() => setIsCommentaryPanelOpen(false)}
                        aria-label="Close verse panel"
                        className="p-2 rounded-full hover:bg-gold-surface dark:hover:bg-dark-surface text-text-secondary dark:text-dark-text-secondary transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="relative flex h-full min-h-0 flex-col p-4 sm:p-5 lg:p-6">
                    <VerseCommentary />
                </div>
            </aside>
        </>
    );
};

export default VerseSidePanel;
