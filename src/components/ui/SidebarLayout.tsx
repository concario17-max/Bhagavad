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
 * Shared drawer / sidebar layout.
 * - Mobile uses an overlay drawer.
 * - Desktop uses a sticky panel.
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
    const placementClass = isLeft ? 'left-0' : 'right-0';
    const borderClass = isLeft ? 'border-r' : 'border-l';
    const closedTranslateClass = isLeft ? '-translate-x-full' : 'translate-x-full';

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/42 backdrop-blur-sm lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                data-testid={isLeft ? 'left-panel' : 'right-panel'}
                data-panel-position={position}
                data-desktop-open={isDesktopOpen ? 'true' : 'false'}
                data-mobile-open={isOpen ? 'true' : 'false'}
                className={[
                    'fixed inset-y-0 z-50 flex h-[100dvh] flex-col overflow-hidden border-gold-primary/12 bg-white/70 backdrop-blur-2xl transition-all duration-300 dark:border-dark-border/70 dark:bg-[#101010]/86',
                    borderClass,
                    placementClass,
                    isOpen ? `${widthClass} translate-x-0 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.45)] lg:shadow-none` : `w-[90vw] ${closedTranslateClass}`,
                    isDesktopOpen ? `${desktopWidthClass} lg:translate-x-0 lg:opacity-100` : 'lg:w-0 lg:translate-x-0 lg:opacity-0 lg:border-none',
                    'lg:sticky lg:top-[calc(var(--header-height,72px))] lg:h-[calc(100dvh-var(--header-height,72px))]'
                ].join(' ')}
            >
                {title && (
                    <div className="flex shrink-0 items-center justify-between border-b border-gold-border/30 px-4 py-4 dark:border-dark-border/50 lg:hidden">
                        <span className="w-full font-crimson text-lg font-bold text-text-primary dark:text-dark-text-primary">
                            {title}
                        </span>
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label={`Close ${title}`}
                            className="rounded-full p-2 text-text-secondary transition-colors hover:bg-gold-surface hover:text-gold-primary dark:text-dark-text-secondary dark:hover:bg-dark-surface dark:hover:text-gold-light"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                )}

                {!title && (
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close panel"
                        className="absolute right-4 top-4 rounded-full p-2 text-text-secondary transition-colors hover:bg-gold-surface hover:text-gold-primary dark:text-dark-text-secondary dark:hover:bg-dark-surface dark:hover:text-gold-light lg:hidden"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}

                {children}
            </aside>
        </>
    );
});
