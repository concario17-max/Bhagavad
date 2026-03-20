import { GitaVerse } from '../../types';

interface VersePrimaryCardProps {
    verse: GitaVerse;
}

const VersePrimaryCard = ({ verse }: VersePrimaryCardProps) => {
    return (
        <section className="mb-6 overflow-hidden rounded-[34px] border border-gold-primary/15 bg-white/72 px-4 py-4 shadow-[0_22px_80px_-48px_rgba(78,56,22,0.52)] backdrop-blur-xl dark:border-dark-border/70 dark:bg-dark-surface/72 sm:px-7 sm:py-5">
            <div className="mx-auto max-w-3xl">
                <div className="mb-3 flex justify-center">
                    <span className="rounded-full border border-gold-primary/15 bg-gold-surface/80 px-4 py-1.5 text-[10px] font-inter uppercase tracking-[0.32em] text-gold-muted dark:border-dark-border/70 dark:bg-dark-bg/70 dark:text-gold-light/80">
                        Primary Verse
                    </span>
                </div>

                <div className="mb-2 text-center px-2 sm:px-0">
                    <p className="font-noto text-[24px] font-bold leading-[1.55] tracking-[0.08em] text-[#7A3030] drop-shadow-sm dark:text-[#E3A28A] sm:text-[30px] sm:leading-[1.5]">
                        {verse.sanskrit}
                    </p>
                </div>

                <div className="mb-2 text-center">
                    <p className="font-noto text-[13px] italic uppercase leading-[1.55] tracking-[0.2em] text-[#9A8868] dark:text-[#D4C3A3] sm:text-[14px]">
                        {verse.iast}
                    </p>
                </div>

                {verse.korean_pronunciation && (
                    <div className="text-center">
                        <p className="mx-auto max-w-2xl font-pretendard text-[14px] leading-[1.7] tracking-[0.01em] text-[#918067] dark:text-[#CBB89B]">
                            {verse.korean_pronunciation}
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default VersePrimaryCard;
