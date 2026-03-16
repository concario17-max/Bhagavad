import { X } from 'lucide-react';
import { useUI } from '../context/UIContext';
import Reflections from './Reflections';
import VerseCommentary from './VerseCommentary';

const VerseSidePanel = () => {
    const {
        activeVersePanel,
        isReflectionsOpen,
        setIsReflectionsOpen,
        isDesktopReflectionsOpen,
        isDesktopSidebarOpen
    } = useUI();

    const isCommentaryPanel = activeVersePanel === 'commentary';
    const mobileWidthClass = isCommentaryPanel ? 'w-[94vw]' : 'w-[90vw]';
    const desktopWidthClass = isCommentaryPanel
        ? (isDesktopSidebarOpen ? 'lg:w-[460px]' : 'lg:w-[760px]')
        : 'lg:w-[380px]';

    return (
        <>
            {isReflectionsOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity duration-300"
                    onClick={() => setIsReflectionsOpen(false)}
                />
            )}

            <aside
                className={`fixed inset-y-0 right-0 z-50 ${mobileWidthClass} bg-white/40 dark:bg-dark-surface/40 backdrop-blur-md border-l border-gold-primary/20 dark:border-dark-border/50 h-full lg:h-[calc(100vh-64px)] lg:sticky lg:top-16 transform transition-all duration-300 flex flex-col font-inter
                    ${isReflectionsOpen ? 'translate-x-0 overflow-hidden shadow-2xl lg:shadow-none' : 'translate-x-full lg:translate-x-0'}
                    ${isDesktopReflectionsOpen ? `${desktopWidthClass} lg:opacity-100` : 'lg:w-0 lg:opacity-0 lg:border-none lg:translate-x-10 px-0 overflow-hidden'}
                `}
            >
                <div className="lg:hidden absolute top-4 right-4 z-50">
                    <button
                        type="button"
                        onClick={() => setIsReflectionsOpen(false)}
                        aria-label="Close verse panel"
                        className="p-2 rounded-full hover:bg-gold-surface dark:hover:bg-dark-surface text-text-secondary dark:text-dark-text-secondary transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="relative flex h-full min-h-0 flex-col p-6">
                    {isCommentaryPanel ? <VerseCommentary /> : <Reflections />}
                </div>
            </aside>
        </>
    );
};

export default VerseSidePanel;
