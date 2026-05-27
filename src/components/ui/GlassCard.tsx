import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export interface GlassCardProps {
    href?: string;
    onClick?: () => void;
    icon?: ReactNode;
    subtitle?: string;
    title: ReactNode;
    description?: string;
    className?: string;
}

export const GlassCard = React.memo(({
    href,
    onClick,
    icon,
    subtitle,
    title,
    description,
    className = ''
}: GlassCardProps) => {
    const content = (
        <>
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.7),transparent_44%),linear-gradient(180deg,rgba(255,255,255,0.4),transparent_42%)] opacity-70 transition-opacity duration-700 dark:bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.06),transparent_44%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_42%)]" />
            <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-gold-primary/35 to-transparent opacity-70 dark:via-gold-light/20" />

            {icon && (
                <div className="relative z-10 mb-6 flex h-11 w-11 items-center justify-center rounded-2xl border border-gold-primary/12 bg-white/70 text-gold-primary shadow-[0_18px_40px_-28px_rgba(78,56,22,0.45)] transition-transform duration-500 group-hover:scale-105 dark:border-dark-border/70 dark:bg-dark-surface/70 dark:text-gold-light">
                    {icon}
                </div>
            )}

            <div className="relative z-10 flex w-full flex-1 flex-col items-center justify-start">
                {subtitle && (
                    <span className="mb-3 block text-[10px] font-black uppercase tracking-[0.34em] text-gold-primary/85 dark:text-gold-light/85">
                        {subtitle}
                    </span>
                )}

                <h2 className="mt-1 flex flex-col gap-1.5 font-pretendard text-[18px] font-semibold tracking-wide text-text-primary dark:text-dark-text-primary sm:text-[19px]">
                    {title}
                </h2>

                <div className="my-4 h-px w-10 bg-gold-border/80 transition-all duration-500 group-hover:w-16 dark:bg-dark-border/80" />

                {description && (
                    <p className="mx-auto max-w-[220px] font-crimson text-[12.5px] italic leading-7 text-text-secondary opacity-90 dark:text-dark-text-secondary">
                        {description}
                    </p>
                )}
            </div>
        </>
    );

    const baseStyle = `group relative flex min-h-[280px] flex-col items-center justify-start overflow-hidden rounded-[30px] border border-gold-primary/12 bg-white/72 px-6 py-8 text-center shadow-[0_22px_60px_-48px_rgba(78,56,22,0.42)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-gold-primary/28 hover:bg-white/86 hover:shadow-[0_28px_80px_-52px_rgba(78,56,22,0.48)] dark:border-dark-border/70 dark:bg-dark-surface/72 dark:hover:border-gold-light/20 dark:hover:bg-dark-surface/88 ${className}`;

    if (href) {
        return (
            <Link to={href} className={baseStyle} onClick={onClick}>
                {content}
            </Link>
        );
    }

    return (
        <button type="button" className={baseStyle} onClick={onClick}>
            {content}
        </button>
    );
});
