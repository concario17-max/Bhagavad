import { TranslationDefinition } from '../../utils/content';

interface VerseTranslationsSectionProps {
    sections: TranslationDefinition[];
    title?: string;
}

const VerseTranslationsSection = ({ sections, title = 'Translation' }: VerseTranslationsSectionProps) => {
    if (sections.length === 0) {
        return null;
    }

    return (
        <section className="w-full rounded-[34px] border border-gold-primary/14 bg-white/70 px-4 py-7 shadow-[0_20px_80px_-52px_rgba(78,56,22,0.48)] backdrop-blur-xl dark:border-dark-border/70 dark:bg-dark-surface/72 sm:px-6 sm:py-8">
            <h2 className="mb-6 text-center font-inter text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-muted dark:text-gold-muted">
                {title}
            </h2>

            <div className="space-y-4">
                {sections.map(section => (
                    <div
                        key={section.id}
                        className="w-full rounded-2xl border border-gold-primary/10 bg-white/65 px-4 py-5 shadow-sm dark:border-dark-border/50 dark:bg-dark-bg/42 sm:px-5"
                    >
                        <h3 className="mb-3 text-center font-inter text-[11px] font-semibold uppercase tracking-[0.24em] text-gold-primary/75 dark:text-gold-light/70">
                            {section.title}
                        </h3>
                        <p className={`${section.className} whitespace-pre-line break-keep text-center text-[15px] leading-8 text-text-primary dark:text-dark-text-primary sm:text-[17px]`}>
                            {section.content}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default VerseTranslationsSection;
