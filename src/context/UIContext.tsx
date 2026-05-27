import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode, Dispatch, SetStateAction } from 'react';

import {
    STORAGE_KEYS,
    getBoolean,
    getDesktopCommentaryPreference,
    setBoolean,
    setDesktopCommentaryPreference
} from '../utils/storage';

type RightPanelMode = 'commentary' | 'deep-dive';

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

const isDesktopViewport = (): boolean => typeof window !== 'undefined' && window.innerWidth >= 1024;

export const UIProvider = ({ children }: UIProviderProps) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(() => getBoolean(STORAGE_KEYS.mobileSidebar, false));
    const [isCommentaryPanelOpen, setIsCommentaryPanelOpen] = useState(() => getBoolean(STORAGE_KEYS.mobileCommentary, false));
    const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState<boolean>(() => getBoolean(STORAGE_KEYS.desktopSidebar, true));
    const [isDesktopCommentaryPanelOpen, setIsDesktopCommentaryPanelOpen] = useState<boolean>(() => getDesktopCommentaryPreference());
    const [rightPanelMode, setRightPanelMode] = useState<RightPanelMode>('commentary');

    useEffect(() => {
        setBoolean(STORAGE_KEYS.mobileSidebar, isSidebarOpen);
    }, [isSidebarOpen]);

    useEffect(() => {
        setBoolean(STORAGE_KEYS.mobileCommentary, isCommentaryPanelOpen);
    }, [isCommentaryPanelOpen]);

    useEffect(() => {
        setBoolean(STORAGE_KEYS.desktopSidebar, isDesktopSidebarOpen);
    }, [isDesktopSidebarOpen]);

    useEffect(() => {
        setDesktopCommentaryPreference(isDesktopCommentaryPanelOpen);
    }, [isDesktopCommentaryPanelOpen]);

    const toggleSidebar = useCallback(() => {
        if (!isDesktopViewport()) {
            setIsSidebarOpen(previous => !previous);
            return;
        }

        setIsDesktopSidebarOpen(previous => !previous);
    }, []);

    const toggleCommentaryPanel = useCallback((forceOpen = false): void => {
        if (!isDesktopViewport()) {
            setIsCommentaryPanelOpen(previous => (forceOpen ? true : !previous));
            return;
        }

        setIsDesktopCommentaryPanelOpen(previous => (forceOpen ? true : !previous));
    }, []);

    const toggleRightPanelMode = useCallback(() => {
        setRightPanelMode(previous => (previous === 'commentary' ? 'deep-dive' : 'commentary'));
    }, []);

    const closeAllDrawers = useCallback(() => {
        setIsSidebarOpen(false);
        setIsCommentaryPanelOpen(false);
    }, []);

    const value = useMemo<UIContextType>(() => ({
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
    }), [
        closeAllDrawers,
        isCommentaryPanelOpen,
        isDesktopCommentaryPanelOpen,
        isDesktopSidebarOpen,
        isSidebarOpen,
        rightPanelMode,
        toggleCommentaryPanel,
        toggleRightPanelMode,
        toggleSidebar
    ]);

    return (
        <UIContext.Provider value={value}>
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
