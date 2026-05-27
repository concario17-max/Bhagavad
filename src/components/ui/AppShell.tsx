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
        <div className="relative flex h-[100dvh] flex-col overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(226,208,177,0.34),_transparent_30%),linear-gradient(180deg,#fdfbf7_0%,#fbf7f0_100%)] text-text-primary transition-colors duration-500 selection:bg-gold-primary/20 selection:text-text-primary dark:bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.04),_transparent_26%),linear-gradient(180deg,#0a0a0a_0%,#111111_100%)] dark:text-dark-text-primary dark:selection:text-dark-text-primary">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.36)_0%,transparent_22%,transparent_78%,rgba(255,255,255,0.18)_100%)] opacity-70 dark:bg-[linear-gradient(115deg,rgba(255,255,255,0.04)_0%,transparent_22%,transparent_78%,rgba(255,255,255,0.02)_100%)]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_top,_rgba(166,139,92,0.22),_transparent_70%)] blur-2xl dark:bg-[radial-gradient(circle_at_top,_rgba(197,174,135,0.08),_transparent_72%)]" />

            <div className="relative z-10 flex h-full min-h-0 flex-col">
                {header}
                <div
                    data-testid="app-shell-grid"
                    className={`relative flex min-h-0 flex-1 overflow-hidden ${desktopGridColumns ? 'lg:grid lg:[grid-template-columns:var(--desktop-verse-columns)]' : ''}`}
                    style={desktopGridStyle}
                >
                    {sidebar}
                    <main
                        id="main-scroll-container"
                        data-testid="main-scroll-container"
                        className={`flex min-h-0 w-full min-w-0 flex-1 flex-col custom-scrollbar ${isMobilePanelOpen ? 'overflow-hidden touch-none' : 'overflow-y-auto'} ${desktopGridColumns ? 'lg:col-start-2 lg:w-full' : ''}`}
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
