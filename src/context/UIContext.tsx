import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';
import {
    STORAGE_KEYS,
    getDesktopCommentaryPreference,
    getBoolean,
    setBoolean,
    setDesktopCommentaryPreference
} from '../utils/storage';

interface UIContextType {
    isSidebarOpen: boolean;
    setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
    isDesktopSidebarOpen: boolean;
    toggleSidebar: () => void;
    isCommentaryPanelOpen: boolean;
    setIsCommentaryPanelOpen: Dispatch<SetStateAction<boolean>>;
    isDesktopCommentaryPanelOpen: boolean;
    toggleCommentaryPanel: (forceOpen?: boolean) => void;
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

    const toggleSidebar = () => {
        if (window.innerWidth < 1024) {
            setIsSidebarOpen(prev => !prev);
            return;
        }

        const newState = !isDesktopSidebarOpen;
        setIsDesktopSidebarOpen(newState);
        setBoolean(STORAGE_KEYS.desktopSidebar, newState);
    };

    const toggleCommentaryPanel = (forceOpen = false): void => {
        if (window.innerWidth < 1024) {
            setIsCommentaryPanelOpen(prev => (forceOpen ? true : !prev));
            return;
        }

        const newState = forceOpen ? true : !isDesktopCommentaryPanelOpen;
        setIsDesktopCommentaryPanelOpen(newState);
        setDesktopCommentaryPreference(newState);
    };

    const closeAllDrawers = () => {
        setIsSidebarOpen(false);
        setIsCommentaryPanelOpen(false);
    };

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
