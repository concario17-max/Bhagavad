import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { VerseWord } from '../../types';
import { STORAGE_KEYS, getBoolean, setBoolean } from '../../utils/storage';

interface VerseLexiconSectionProps {
    words?: VerseWord[];
    embedded?: boolean;
}

const VerseLexiconSection = ({ words, embedded = false }: VerseLexiconSectionProps) => {
    const [showLexicon, setShowLexicon] = useState<boolean>(() => getBoolean(STORAGE_KEYS.showLexicon, false));

    useEffect(() => {
        setBoolean(STORAGE_KEYS.showLexicon, showLexicon);
    }, [showLexicon]);

    const sectionClasses = embedded
        ? 'rounded-[26px] border border-gold-primary/10 bg-white/54 px-2.5 py-3 backdrop-blur-md dark:border-dark-border/50 dark:bg-dark-surface/54 sm:px-3 sm:py-4'
        : 'mb-14 rounded-[30px] border border-gold-primary/12 bg-white/60 px-4 py-6 backdrop-blur-md dark:border-dark-border/60 dark:bg-dark-surface/60 sm:px-6 sm:py-7';

    const headerClasses = embedded ? 'relative mb-3 flex items-center justify-end' : 'mb-6 flex items-center justify-center';

    return (
        <section className={sectionClasses}>
            <div className={headerClasses}>
                <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-xs font-semibold uppercase tracking-[0.24em] text-gold-muted transition-colors font-inter dark:text-gold-muted">
                    Word-by-word
                </span>
                <button
                    onClick={() => setShowLexicon(previous => !previous)}
                    className="group flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-gold-primary/20 bg-white/60 transition-colors hover:border-gold-primary/50 dark:bg-dark-bg/50 focus:outline-none"
                >
                    {showLexicon ? (
                        <ChevronUp className="w-3.5 h-3.5 text-gold-muted transition-colors group-hover:text-gold-primary" />
                    ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-gold-muted transition-colors group-hover:text-gold-primary" />
                    )}
                </button>
            </div>

            <div className={`transition-all duration-500 overflow-hidden ${showLexicon ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div
                    className={`mx-auto grid w-full grid-cols-1 gap-2 px-1 sm:px-2 ${
                        embedded ? 'max-w-[760px] sm:grid-cols-2 lg:grid-cols-2' : 'max-w-4xl sm:grid-cols-2 lg:grid-cols-3'
                    }`}
                >
                    {words?.map((word, index) => (
                        <div key={`${word.s}-${index}`} className="group relative overflow-hidden rounded-xl border border-gold-primary/10 bg-white/72 px-3 py-2.5 shadow-sm backdrop-blur-sm dark:border-dark-border/50 dark:bg-dark-bg/42">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                            <span className="mb-0.5 block font-crimson text-[16px] font-bold text-text-primary dark:text-dark-text-primary">{word.s}</span>
                            <span className="font-inter text-[13px] leading-relaxed text-text-secondary dark:text-dark-text-secondary break-keep">{word.m.trim()}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default VerseLexiconSection;
