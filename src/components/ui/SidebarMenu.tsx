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
 * 범용 아코디언 메뉴 시스템 (Zero Monolith)
 * - 특정 도메인(Gita)에 종속되지 않고 라우팅 배열만 받아서 처리
 */
export const SidebarMenu = React.memo(({ groups, onItemClick, groupTitle }: SidebarMenuProps) => {
    return (
        <>
            {/* Top Half: Groups */}
            <div className="flex-1 overflow-y-auto border-b border-gold-border/40 dark:border-[#222] custom-scrollbar min-h-0 overscroll-contain">
                {groupTitle && (
                    <div className="p-4 bg-transparent sticky top-0 z-10 backdrop-blur-sm hidden lg:block">
                        <h2 className="text-xs font-bold text-text-primary/70 dark:text-dark-text-primary/70">
                            {groupTitle}
                        </h2>
                    </div>
                )}

                <div className="py-1 px-2 space-y-0.5">
                    {groups.map((group) => (
                        <button
                            key={group.id}
                            onClick={group.onToggle}
                            className={`w-full flex items-start justify-between gap-1.5 px-2 py-1.5 sm:px-1.5 sm:py-1 rounded-lg text-left transition-colors ${group.isExpanded
                                    ? 'bg-white/60 dark:bg-dark-bg/60 shadow-sm border border-gold-primary/20 text-[#1C2B36] dark:text-gold-light'
                                    : 'text-[#5B7282] dark:text-dark-text-secondary hover:bg-gold-surface/40 dark:hover:bg-dark-bg/40 border border-transparent'
                                }`}
                        >
                            <div className="flex-1 pr-1 flex flex-col pt-0">
                                <span className={`text-[14px] sm:text-[13px] leading-snug font-inter break-keep ${group.isExpanded ? 'font-bold text-[#1C2B36]' : 'font-bold'}`}>
                                    {group.title}
                                </span>
                                {group.subtitle && (
                                    <span className={`text-[12px] sm:text-[11.5px] font-inter break-keep mt-0 ${group.isExpanded ? 'opacity-50 text-[#1C2B36] font-medium' : 'opacity-60 font-medium'}`}>
                                        {group.subtitle}
                                    </span>
                                )}
                            </div>
                            {group.badge && (
                                <span className={`shrink-0 mt-0 text-[#A68B5C] px-1.5 py-0.5 rounded text-[11px] font-bold ${group.isExpanded ? 'opacity-100' : 'opacity-70'}`}>
                                    {group.badge}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Bottom Half: Items */}
            <div className="flex-1 overflow-y-auto bg-transparent custom-scrollbar overscroll-contain">
                <div className="py-1 px-2 space-y-0">
                    {groups.find(g => g.isExpanded) ? (
                        groups.find(g => g.isExpanded)?.items.map((item) => (
                            <NavLink
                                key={item.id}
                                to={item.href}
                                onClick={onItemClick}
                                className={({ isActive }) =>
                                    `flex items-start gap-2 px-3 py-2 sm:px-2 sm:py-1.5 rounded-lg text-sm transition-all ${isActive || item.isActive
                                        ? 'bg-white/60 border border-gold-primary/30 text-text-primary font-medium shadow-sm dark:bg-dark-bg/60 dark:border-gold-primary/20 dark:text-gold-light'
                                        : 'border border-transparent text-text-secondary dark:text-dark-text-secondary hover:text-text-primary hover:bg-gold-surface/30 dark:hover:bg-dark-bg/40'
                                    }`
                                }
                            >
                                <span className={`min-w-[45px] whitespace-nowrap font-bold text-xs sm:text-[13px] mt-[2px] ${item.isActive ? 'text-gold-primary' : 'text-text-secondary/60 dark:text-dark-text-secondary/60'}`}>
                                    {item.label}
                                </span>
                                {item.description && (
                                    <span className="truncate opacity-90 text-[14px] sm:text-[13px] leading-relaxed font-inter">
                                        {item.description}
                                    </span>
                                )}
                            </NavLink>
                        ))
                    ) : (
                        <div className="p-8 text-center text-text-secondary dark:text-dark-text-secondary text-sm">
                            항목을 선택해주세요
                        </div>
                    )}
                </div>
            </div>
        </>
    );
});
