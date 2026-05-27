export const DESKTOP_VERSE_COLUMNS_DEFAULT = '20% 60% 20%';
export const DESKTOP_VERSE_COLUMNS_LEFT_CLOSED = '0% 60% 40%';
export const DESKTOP_VERSE_COLUMNS_NO_RIGHT = '20% 80% 0%';
export const DESKTOP_VERSE_COLUMNS_FULL_WIDTH = '0% 100% 0%';

export const getDesktopVerseColumns = (isDesktopSidebarOpen: boolean, isDesktopRightPanelOpen: boolean): string => {
    if (!isDesktopRightPanelOpen) {
        return isDesktopSidebarOpen ? DESKTOP_VERSE_COLUMNS_NO_RIGHT : DESKTOP_VERSE_COLUMNS_FULL_WIDTH;
    }

    return isDesktopSidebarOpen ? DESKTOP_VERSE_COLUMNS_DEFAULT : DESKTOP_VERSE_COLUMNS_LEFT_CLOSED;
};
