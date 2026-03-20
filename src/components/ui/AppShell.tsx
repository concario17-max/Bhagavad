import React, { ReactNode } from 'react';

export interface AppShellProps {
    header?: ReactNode;
    sidebar?: ReactNode;
    rightPanel?: ReactNode;
    floatingAction?: ReactNode;
    children: ReactNode;
    isMobilePanelOpen?: boolean;
    desktopGridColumns?: string;
}

export const AppShell = React.memo(({
    header,
    sidebar,
    rightPanel,
    floatingAction,
    children,
    isMobilePanelOpen = false,
    desktopGridColumns
}: AppShellProps) => {
    const desktopGridStyle = desktopGridColumns
        ? ({ '--desktop-verse-columns': desktopGridColumns } as React.CSSProperties)
        : undefined;

    return (
        <div className="h-[100dvh] flex flex-col bg-gold-bg dark:bg-dark-bg transition-colors duration-500 relative selection:bg-gold-primary/20 selection:text-text-primary dark:selection:text-dark-text-primary overflow-hidden">
            <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.65)_0%,_transparent_80%)] dark:bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.04)_0%,_transparent_80%)] z-0"></div>

            <div className="relative z-10 flex flex-col flex-1 h-full overflow-hidden">
                {header}
                <div
                    data-testid="app-shell-grid"
                    className={`flex flex-1 relative overflow-hidden ${desktopGridColumns ? 'lg:grid lg:[grid-template-columns:var(--desktop-verse-columns)]' : ''}`}
                    style={desktopGridStyle}
                >
                    {sidebar}
                    <main
                        id="main-scroll-container"
                        data-testid="main-scroll-container"
                        className={`flex-1 min-w-0 w-full lg:w-auto custom-scrollbar flex flex-col min-h-full ${isMobilePanelOpen ? 'overflow-hidden touch-none' : 'overflow-y-auto'} ${desktopGridColumns ? 'lg:col-start-2 lg:w-full' : ''}`}
                    >
                        {children}
                    </main>
                    {rightPanel}
                </div>
                {floatingAction && (
                    <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50">
                        {floatingAction}
                    </div>
                )}
            </div>
        </div>
    );
});
