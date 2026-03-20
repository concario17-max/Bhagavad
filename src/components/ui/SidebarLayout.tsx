import React, { ReactNode } from 'react';
import { X } from 'lucide-react';

export interface SidebarLayoutProps {
    isOpen: boolean;
    isDesktopOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    position?: 'left' | 'right';
    widthClass?: string;
    desktopWidthClass?: string;
}

/**
 * 범용 Drawer / Sidebar 레이아웃 (Zero Monolith)
 * - 배경 블러 효과 및 좌/우측 오버레이 트랜지션 로직 캡슐화
 */
export const SidebarLayout = React.memo(({
    isOpen,
    isDesktopOpen,
    onClose,
    title,
    children,
    position = 'left',
    widthClass = 'w-80',
    desktopWidthClass = 'lg:w-80'
}: SidebarLayoutProps) => {
    const isLeft = position === 'left';
    const mobileTranslateClosed = isLeft ? '-translate-x-full' : 'translate-x-full';
    const borderClass = isLeft ? 'border-r' : 'border-l';
    const placementClass = isLeft ? 'left-0' : 'right-0';
    const mobileStateClass = isOpen
        ? `${widthClass} translate-x-0 overflow-hidden shadow-2xl lg:shadow-none`
        : `w-[90vw] ${mobileTranslateClosed}`;
    const desktopStateClass = isDesktopOpen
        ? `${desktopWidthClass} lg:translate-x-0 lg:opacity-100`
        : 'overflow-hidden p-0 px-0 lg:w-0 lg:border-none lg:translate-x-0 lg:opacity-0';

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity duration-300 opacity-100 touch-none"
                    onClick={onClose}
                />
            )}

            <aside
                data-testid={isLeft ? 'left-panel' : 'right-panel'}
                data-panel-position={position}
                data-desktop-open={isDesktopOpen ? 'true' : 'false'}
                data-mobile-open={isOpen ? 'true' : 'false'}
                className={`fixed inset-y-0 ${placementClass} z-50 bg-white/46 dark:bg-[#101010]/82 backdrop-blur-xl ${borderClass} border-gold-primary/14 dark:border-dark-border/70 h-[100dvh] lg:h-[calc(100vh-72px)] lg:sticky lg:top-[72px] transform transition-all duration-300 flex flex-col font-inter overscroll-contain
                ${mobileStateClass}
                ${desktopStateClass}
            `}
            >
                {title && (
                    <div className="lg:hidden flex items-center justify-between p-4 border-b border-gold-border/30 dark:border-[#333] shrink-0">
                        <span className="font-crimson font-bold text-lg text-text-primary dark:text-dark-text-primary w-full">{title}</span>
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label={`Close ${title}`}
                            className="p-2 -mr-2 rounded-full hover:bg-gold-surface dark:hover:bg-dark-surface text-text-secondary dark:text-dark-text-secondary transition-colors absolute right-4"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {!title && (
                    <div className="lg:hidden absolute top-4 right-4 z-50">
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close panel"
                            className="p-2 rounded-full hover:bg-gold-surface dark:hover:bg-dark-surface text-text-secondary dark:text-dark-text-secondary transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {children}
            </aside>
        </>
    );
});
