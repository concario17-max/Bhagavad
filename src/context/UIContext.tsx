import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

interface UIContextType {
    isSidebarOpen: boolean;
    setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
    isDesktopSidebarOpen: boolean;
    toggleSidebar: () => void;
    isReflectionsOpen: boolean;
    setIsReflectionsOpen: Dispatch<SetStateAction<boolean>>;
    isDesktopReflectionsOpen: boolean;
    toggleReflections: () => void;
    closeAllDrawers: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

interface UIProviderProps {
    children: ReactNode;
}

export const UIProvider = ({ children }: UIProviderProps) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const [isReflectionsOpen, setIsReflectionsOpen] = useState<boolean>(false);

    // Desktop Panel States
    const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('gita-desktop-sidebar');
            return saved !== null ? JSON.parse(saved) : true;
        }
        return true;
    });

    const [isDesktopReflectionsOpen, setIsDesktopReflectionsOpen] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('gita-desktop-reflections');
            return saved !== null ? JSON.parse(saved) : true;
        }
        return true;
    });

    const toggleSidebar = () => {
        if (window.innerWidth < 1024) {
            setIsSidebarOpen(prev => !prev);
        } else {
            const newState = !isDesktopSidebarOpen;
            setIsDesktopSidebarOpen(newState);
            localStorage.setItem('gita-desktop-sidebar', JSON.stringify(newState));
        }
    };

    const toggleReflections = () => {
        if (window.innerWidth < 1024) {
            setIsReflectionsOpen(prev => !prev);
        } else {
            const newState = !isDesktopReflectionsOpen;
            setIsDesktopReflectionsOpen(newState);
            localStorage.setItem('gita-desktop-reflections', JSON.stringify(newState));
        }
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
