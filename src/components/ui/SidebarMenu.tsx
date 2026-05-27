import React from 'react';
import { NavLink } from 'react-router-dom';

export interface NavItemType {
    id: string;
    label: string | React.ReactNode;
    href: string;
    isActive?: boolean;
    description?: string;
}

export interface NavGroupType {
    id: string | number;
    title: string | React.ReactNode;
    subtitle?: string;
    badge?: string | number;
    isExpanded: boolean;
    onToggle: () => void;
    items: NavItemType[];
}

interface SidebarMenuProps {
    groups: NavGroupType[];
    onItemClick: () => void;
    groupTitle?: string;
}

/**
 * Shared accordion navigation.
 * - It only knows about routing data and renders generically.
 */
export const SidebarMenu = React.memo(({ groups, onItemClick, groupTitle }: SidebarMenuProps) => {
    const activeGroup = groups.find(group => group.isExpanded);

    return (
        <>
            <div className="basis-[31%] min-h-0 overflow-y-auto border-b border-gold-border/35 custom-scrollbar overscroll-contain dark:border-dark-border/60">
                {groupTitle && (
                    <div className="sticky top-0 z-10 hidden border-b border-gold-border/20 bg-white/78 px-4 py-4 backdrop-blur-sm dark:border-dark-border/50 dark:bg-[#101010]/70 lg:block">
                        <h2 className="text-xs font-bold uppercase tracking-[0.24em] text-text-primary/70 dark:text-dark-text-primary/70">
                            {groupTitle}
                        </h2>
                    </div>
                )}

                <div className="space-y-1 px-2 py-2">
                    {groups.map(group => (
                        <button
                            key={group.id}
                            type="button"
                            onClick={group.onToggle}
                            className={`flex w-full items-start justify-between gap-2 rounded-[18px] border px-3 py-2.5 text-left transition-all duration-300 hover:-translate-y-px ${
                                group.isExpanded
                                    ? 'border-gold-primary/25 bg-white/88 text-text-primary shadow-[0_14px_28px_-22px_rgba(78,56,22,0.45)] dark:border-gold-light/20 dark:bg-dark-surface/88 dark:text-dark-text-primary'
                                    : 'border-transparent text-text-secondary hover:border-gold-primary/15 hover:bg-gold-surface/35 hover:text-text-primary dark:text-dark-text-secondary dark:hover:border-dark-border/60 dark:hover:bg-dark-bg/40'
                            }`}
                        >
                            <div className="min-w-0 flex-1">
                                <span className={`block break-keep text-[14px] font-bold leading-snug ${group.isExpanded ? 'text-text-primary dark:text-dark-text-primary' : ''}`}>
                                    {group.title}
                                </span>
                                {group.subtitle && (
                                    <span className={`mt-1 block break-keep text-[12px] leading-snug ${group.isExpanded ? 'text-text-secondary dark:text-dark-text-secondary' : 'text-text-secondary/75 dark:text-dark-text-secondary/75'}`}>
                                        {group.subtitle}
                                    </span>
                                )}
                            </div>
                            {group.badge && (
                                <span className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-bold tracking-wide ${
                                    group.isExpanded
                                        ? 'bg-gold-primary text-white dark:bg-gold-light dark:text-[#1C2B36]'
                                        : 'bg-gold-surface/70 text-gold-primary dark:bg-dark-bg/60 dark:text-gold-light'
                                }`}>
                                    {group.badge}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <div className="basis-[69%] min-h-0 overflow-y-auto custom-scrollbar overscroll-contain">
                <div className="space-y-1 px-2 py-2">
                    {activeGroup ? (
                        activeGroup.items.map(item => (
                            <NavLink
                                key={item.id}
                                to={item.href}
                                onClick={onItemClick}
                                className={({ isActive }) =>
                                    `flex items-start gap-3 rounded-[18px] border px-3 py-2.5 text-sm transition-all duration-300 hover:-translate-y-px ${
                                        isActive || item.isActive
                                            ? 'border-gold-primary/25 bg-white/88 text-text-primary shadow-[0_14px_28px_-22px_rgba(78,56,22,0.45)] dark:border-gold-light/20 dark:bg-dark-surface/88 dark:text-dark-text-primary'
                                            : 'border-transparent text-text-secondary hover:border-gold-primary/15 hover:bg-gold-surface/30 hover:text-text-primary dark:text-dark-text-secondary dark:hover:border-dark-border/60 dark:hover:bg-dark-bg/40'
                                    }`
                                }
                            >
                                <span className={`min-w-[3.5rem] shrink-0 whitespace-nowrap font-bold text-xs tracking-wide ${item.isActive ? 'text-gold-primary dark:text-gold-light' : 'text-text-secondary/75 dark:text-dark-text-secondary/75'}`}>
                                    {item.label}
                                </span>
                                {item.description && (
                                    <span className="truncate text-[13px] leading-relaxed text-inherit">
                                        {item.description}
                                    </span>
                                )}
                            </NavLink>
                        ))
                    ) : (
                        <div className="px-4 py-10 text-center text-sm text-text-secondary dark:text-dark-text-secondary">
                            Select an item
                        </div>
                    )}
                </div>
            </div>
        </>
    );
});
