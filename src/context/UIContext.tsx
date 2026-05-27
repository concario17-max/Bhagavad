import { createContext, useCallback, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';
import {
    STORAGE_KEYS,
    getDesktopCommentaryPreference,
    getBoolean,
    setBoolean,
    setDesktopCommentaryPreference
} from '../utils/storage';

type RightPanelMode = 'summary' | 'translation' | 'keywords';

interface UIContextType {
    isSidebarOpen: boolean;
    setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
    isDesktopSidebarOpen: boolean;
    toggleSidebar: () => void;
    isCommentaryPanelOpen: boolean;
    setIsCommentaryPanelOpen: Dispatch<SetStateAction<boolean>>;
    isDesktopCommentaryPanelOpen: boolean;
    toggleCommentaryPanel: (forceOpen?: boolean) => void;
    rightPanelMode: RightPanelMode;
    setRightPanelMode: Dispatch<SetStateAction<RightPanelMode>>;
    toggleRightPanelMode: () => void;
    closeAllDrawers: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

interface UIProviderProps {
    children: ReactNode;
}

export const UIProvider = ({ children }: UIProviderProps) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCommentaryPanelOpen, setIsCommentaryPanelOpen] = useState(false);
    const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState<boolean>(() => getBoolean(STORAGE_KEYS.desktopSidebar, true));
    const [isDesktopCommentaryPanelOpen, setIsDesktopCommentaryPanelOpen] = useState<boolean>(() => getDesktopCommentaryPreference());
    const [rightPanelMode, setRightPanelMode] = useState<RightPanelMode>('summary');

    const toggleSidebar = useCallback(() => {
        if (window.innerWidth < 1024) {
            setIsSidebarOpen(prev => !prev);
            return;
        }

        const newState = !isDesktopSidebarOpen;
        setIsDesktopSidebarOpen(newState);
        setBoolean(STORAGE_KEYS.desktopSidebar, newState);
    }, [isDesktopSidebarOpen]);

    const toggleCommentaryPanel = useCallback((forceOpen = false): void => {
        if (window.innerWidth < 1024) {
            setIsCommentaryPanelOpen(prev => (forceOpen ? true : !prev));
            return;
        }

        const newState = forceOpen ? true : !isDesktopCommentaryPanelOpen;
        setIsDesktopCommentaryPanelOpen(newState);
        setDesktopCommentaryPreference(newState);
    }, [isDesktopCommentaryPanelOpen]);

    const toggleRightPanelMode = useCallback(() => {
        setRightPanelMode(previous => {
            if (previous === 'summary') {
                return 'translation';
            }

            if (previous === 'translation') {
                return 'keywords';
            }

            return 'summary';
        });
    }, []);

    const closeAllDrawers = useCallback(() => {
        setIsSidebarOpen(false);
        setIsCommentaryPanelOpen(false);
    }, []);

    return (
        <UIContext.Provider value={{
            isSidebarOpen,
            setIsSidebarOpen,
            isDesktopSidebarOpen,
            toggleSidebar,
            isCommentaryPanelOpen,
            setIsCommentaryPanelOpen,
            isDesktopCommentaryPanelOpen,
            toggleCommentaryPanel,
            rightPanelMode,
            setRightPanelMode,
            toggleRightPanelMode,
            closeAllDrawers
        }}>
            {children}
        </UIContext.Provider>
    );
};

export const useUI = (): UIContextType => {
    const context = useContext(UIContext);
    if (context === undefined) {
        throw new Error('useUI must be used within a UIProvider');
    }
    return context;
};
