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
            {/* Soft hover highlight for the card surface. */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-transparent dark:from-white/[0.03] dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0 pointer-events-none"></div>

            {icon && (
                <div className="w-8 h-8 flex items-center justify-center text-gold-primary/60 mb-6 group-hover:scale-110 transition-transform relative z-10">
                    {icon}
                </div>
            )}

            <div className="relative z-10 w-full mb-auto flex flex-col items-center">
                {subtitle && (
                    <span className="block mb-3 text-[11px] font-black tracking-[0.35em] uppercase text-gold-primary/90 dark:text-gold-light/90 drop-shadow-sm">
                        {subtitle}
                    </span>
                )}

                <h2 className="font-bold tracking-wide mb-5 text-text-primary dark:text-dark-text-primary font-pretendard flex flex-col gap-1.5 mt-1">
                    {title}
                </h2>

                <div className="w-8 h-[1px] bg-gold-border/80 mx-auto my-3 group-hover:w-16 transition-all duration-500"></div>

                {description && (
                    <p className="text-[12px] text-text-secondary dark:text-dark-text-secondary font-crimson italic max-w-[200px] mx-auto opacity-90">
                        {description}
                    </p>
                )}
            </div>
        </>
    );

    const baseStyle = `group relative flex flex-col items-center justify-start text-center p-6 sm:p-8 pt-10 sm:pt-16 bg-white/50 dark:bg-[#161616]/70 backdrop-blur-md border border-gold-border/50 hover:border-gold-primary/70 rounded-2xl shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-gold-primary/20 dark:shadow-none dark:hover:shadow-[0_8px_30px_-5px_rgba(0,0,0,0.6)] transition-all duration-700 min-h-[280px] sm:min-h-[340px] overflow-hidden ${className}`;

    if (href) {
        return (
            <Link to={href} className={baseStyle} onClick={onClick}>
                {content}
            </Link>
        );
    }

    return (
        <button className={baseStyle} onClick={onClick}>
            {content}
        </button>
    );
});
