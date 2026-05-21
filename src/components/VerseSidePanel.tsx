import { useUI } from '../context/UIContext';
import VerseCommentary from './VerseCommentary';
import { SidebarLayout } from './ui/SidebarLayout';

const VerseSidePanel = () => {
    const {
        isCommentaryPanelOpen,
        setIsCommentaryPanelOpen,
        isDesktopCommentaryPanelOpen
    } = useUI();

    return (
        <SidebarLayout
            isOpen={isCommentaryPanelOpen}
            isDesktopOpen={isDesktopCommentaryPanelOpen}
            onClose={() => setIsCommentaryPanelOpen(false)}
            position="right"
            widthClass="w-[94vw]"
            desktopWidthClass="lg:col-start-3 lg:w-full"
        >
            <div className="relative flex h-full min-h-0 flex-col p-4 sm:p-5 lg:p-6">
                <VerseCommentary />
            </div>
        </SidebarLayout>
    );
};

export default VerseSidePanel;
