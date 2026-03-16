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
    widthClass = 'w-80'
}: SidebarLayoutProps) => {

    const isLeft = position === 'left';
    const translateClosed = isLeft ? '-translate-x-full lg:-translate-x-10' : 'translate-x-full lg:translate-x-10';
    const borderClass = isLeft ? 'border-r' : 'border-l';
    const placementClass = isLeft ? 'left-0' : 'right-0';

    const lgWidthClass = {
        'w-64': 'lg:w-64',
        'w-72': 'lg:w-72',
        'w-80': 'lg:w-80',
        'w-96': 'lg:w-96'
    }[widthClass] || `lg:${widthClass}`;

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity duration-300 opacity-100 touch-none"
                    onClick={onClose}
                />
            )}

            <aside className={`fixed inset-y-0 ${placementClass} z-50 bg-white/40 dark:bg-dark-surface/40 backdrop-blur-md ${borderClass} border-gold-primary/20 dark:border-dark-border/50 h-[100dvh] lg:h-[calc(100vh-64px)] lg:sticky lg:top-16 transform transition-all duration-300 flex flex-col font-inter overscroll-contain
                ${isOpen ? `${widthClass} translate-x-0 overflow-hidden shadow-2xl lg:shadow-none` : `w-[90vw] ${lgWidthClass} ${translateClosed} lg:translate-x-0`}
                ${isDesktopOpen ? `${lgWidthClass} lg:opacity-100` : `lg:w-0 lg:opacity-0 lg:border-none p-0 px-0 overflow-hidden`}
            `}>

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
