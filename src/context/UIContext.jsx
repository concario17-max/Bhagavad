import { createContext, useContext, useState } from 'react';

const UIContext = createContext();

export const UIProvider = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isReflectionsOpen, setIsReflectionsOpen] = useState(false);

    // Desktop Panel States
    const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('gita-desktop-sidebar');
            return saved !== null ? JSON.parse(saved) : true;
        }
        return true;
    });

    const [isDesktopReflectionsOpen, setIsDesktopReflectionsOpen] = useState(() => {
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

export const useUI = () => useContext(UIContext);
