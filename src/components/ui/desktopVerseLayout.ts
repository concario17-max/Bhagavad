export const DESKTOP_VERSE_COLUMNS_DEFAULT = 'minmax(17rem, 19vw) minmax(0, 1fr) minmax(16rem, 22vw)';
export const DESKTOP_VERSE_COLUMNS_LEFT_CLOSED = '0 minmax(0, 1fr) minmax(16rem, 22vw)';
export const DESKTOP_VERSE_COLUMNS_NO_RIGHT = 'minmax(17rem, 19vw) minmax(0, 1fr) 0';
export const DESKTOP_VERSE_COLUMNS_FULL_WIDTH = '0 minmax(0, 1fr) 0';

export const getDesktopVerseColumns = (isDesktopSidebarOpen: boolean, isDesktopRightPanelOpen: boolean): string => {
    if (!isDesktopRightPanelOpen) {
        return isDesktopSidebarOpen ? DESKTOP_VERSE_COLUMNS_NO_RIGHT : DESKTOP_VERSE_COLUMNS_FULL_WIDTH;
    }

    return isDesktopSidebarOpen ? DESKTOP_VERSE_COLUMNS_DEFAULT : DESKTOP_VERSE_COLUMNS_LEFT_CLOSED;
};
