import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';
import {
    STORAGE_KEYS,
    getActiveVersePanel,
    getBoolean,
    setActiveVersePanelPreference,
    setBoolean
} from '../utils/storage';

export type VersePanelMode = 'notes' | 'commentary';

interface UIContextType {
    isSidebarOpen: boolean;
    setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
    isDesktopSidebarOpen: boolean;
    toggleSidebar: () => void;
    isReflectionsOpen: boolean;
    setIsReflectionsOpen: Dispatch<SetStateAction<boolean>>;
    isDesktopReflectionsOpen: boolean;
    toggleReflections: (forceOpen?: boolean) => void;
    activeVersePanel: VersePanelMode;
    setActiveVersePanel: Dispatch<SetStateAction<VersePanelMode>>;
    closeAllDrawers: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

interface UIProviderProps {
    children: ReactNode;
}

export const UIProvider = ({ children }: UIProviderProps) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isReflectionsOpen, setIsReflectionsOpen] = useState(false);
    const [activeVersePanel, setActiveVersePanelState] = useState<VersePanelMode>(() => getActiveVersePanel());
    const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState<boolean>(() => getBoolean(STORAGE_KEYS.desktopSidebar, true));
    const [isDesktopReflectionsOpen, setIsDesktopReflectionsOpen] = useState<boolean>(() => getBoolean(STORAGE_KEYS.desktopReflections, true));

    const setActiveVersePanel: Dispatch<SetStateAction<VersePanelMode>> = value => {
        setActiveVersePanelState(previous => {
            const nextValue = typeof value === 'function' ? value(previous) : value;
            setActiveVersePanelPreference(nextValue);
            return nextValue;
        });
    };

    const toggleSidebar = () => {
        if (window.innerWidth < 1024) {
            setIsSidebarOpen(prev => !prev);
            return;
        }

        const newState = !isDesktopSidebarOpen;
        setIsDesktopSidebarOpen(newState);
        setBoolean(STORAGE_KEYS.desktopSidebar, newState);
    };

    const toggleReflections = (forceOpen = false) => {
        if (window.innerWidth < 1024) {
            setIsReflectionsOpen(prev => (forceOpen ? true : !prev));
            return;
        }

        const newState = forceOpen ? true : !isDesktopReflectionsOpen;
        setIsDesktopReflectionsOpen(newState);
        setBoolean(STORAGE_KEYS.desktopReflections, newState);
    };

    const closeAllDrawers = () => {
        setIsSidebarOpen(false);
        setIsReflectionsOpen(false);
    };

    return (
        <UIContext.Provider value={{
            isSidebarOpen,
            setIsSidebarOpen,
            isDesktopSidebarOpen,
            toggleSidebar,
            isReflectionsOpen,
            setIsReflectionsOpen,
            isDesktopReflectionsOpen,
            toggleReflections,
            activeVersePanel,
            setActiveVersePanel,
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
