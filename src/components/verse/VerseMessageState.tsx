interface VerseMessageStateProps {
    description: string;
    title: string;
}

const VerseMessageState = ({ description, title }: VerseMessageStateProps) => {
    return (
        <div className="flex min-h-[60vh] items-center justify-center">
            <div className="w-full max-w-2xl rounded-[34px] border border-gold-primary/14 bg-white/75 px-6 py-12 text-center shadow-[0_20px_80px_-52px_rgba(78,56,22,0.48)] backdrop-blur-xl dark:border-dark-border/70 dark:bg-dark-surface/72 sm:px-10">
                <h2 className="font-crimson text-3xl tracking-[0.08em] text-text-primary dark:text-dark-text-primary">
                    {title}
                </h2>
                <p className="mt-4 font-pretendard text-[15px] leading-8 text-text-secondary dark:text-dark-text-secondary">
                    {description}
                </p>
            </div>
        </div>
    );
};

export default VerseMessageState;
