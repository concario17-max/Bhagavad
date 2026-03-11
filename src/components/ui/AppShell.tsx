import React, { ReactNode } from 'react';

export interface AppShellProps {
    header?: ReactNode;
    sidebar?: ReactNode;
    rightPanel?: ReactNode;
    floatingAction?: ReactNode;
    children: ReactNode;
    isMobilePanelOpen?: boolean; // to apply touch-none overflow-hidden to main content when mobile panels are open
}

/**
 * 전역 App Shell 레이아웃 (Zero Monolith)
 * - 100dvh 대응, 고화질 Radial Gradient 스포트라이트 배경
 * - 상단/사이드/본문의 flex-1 유연한 레이아웃 보장
 */
export const AppShell = React.memo(({
    header,
    sidebar,
    rightPanel,
    floatingAction,
    children,
    isMobilePanelOpen = false
}: AppShellProps) => {
    return (
        <div className="h-[100dvh] flex flex-col bg-gold-bg dark:bg-dark-bg transition-colors duration-500 relative selection:bg-gold-primary/20 selection:text-text-primary dark:selection:text-dark-text-primary overflow-hidden">
            {/* Ambient luxury spotlight overlay. */}
            <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.65)_0%,_transparent_80%)] dark:bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.04)_0%,_transparent_80%)] z-0"></div>

            <div className="relative z-10 flex flex-col flex-1 h-full overflow-hidden">
                {header}
                <div className="flex flex-1 relative overflow-hidden">
                    {sidebar}
                    <main className={`flex-1 min-w-0 w-full lg:w-auto custom-scrollbar flex flex-col justify-center min-h-full ${isMobilePanelOpen ? 'overflow-hidden touch-none' : 'overflow-y-auto'}`}>
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
