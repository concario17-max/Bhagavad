import { createContext, useContext, useState } from 'react';

const UIContext = createContext();

export const UIProvider = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isReflectionsOpen, setIsReflectionsOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
    const toggleReflections = () => setIsReflectionsOpen(prev => !prev);
    const closeAllDrawers = () => {
        setIsSidebarOpen(false);
        setIsReflectionsOpen(false);
    };

    return (
        <UIContext.Provider value={{
            isSidebarOpen,
            setIsSidebarOpen,
            toggleSidebar,
            isReflectionsOpen,
            setIsReflectionsOpen,
            toggleReflections,
            closeAllDrawers
        }}>
            {children}
        </UIContext.Provider>
    );
};

export const useUI = () => useContext(UIContext);
