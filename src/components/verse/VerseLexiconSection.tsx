import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { VerseWord } from '../../types';
import { STORAGE_KEYS, getBoolean, setBoolean } from '../../utils/storage';

interface VerseLexiconSectionProps {
    words?: VerseWord[];
}

const VerseLexiconSection = ({ words }: VerseLexiconSectionProps) => {
    const [showLexicon, setShowLexicon] = useState<boolean>(() => getBoolean(STORAGE_KEYS.showLexicon, false));

    useEffect(() => {
        setBoolean(STORAGE_KEYS.showLexicon, showLexicon);
    }, [showLexicon]);

    return (
        <section className="mb-14 rounded-[30px] border border-gold-primary/12 bg-white/60 px-4 py-6 backdrop-blur-md dark:border-dark-border/60 dark:bg-dark-surface/60 sm:px-6 sm:py-7">
            <div className="mb-6 flex items-center justify-center">
                <button
                    onClick={() => setShowLexicon(previous => !previous)}
                    className="group flex flex-col items-center gap-1.5 focus:outline-none"
                >
                    <span className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-muted dark:text-gold-muted group-hover:text-gold-primary transition-colors font-inter">
                        Word-by-word
                    </span>
                    <div className="flex h-7 w-7 items-center justify-center rounded-full border border-gold-primary/20 bg-white/60 transition-colors group-hover:border-gold-primary/50 dark:bg-dark-bg/50">
                        {showLexicon ? (
                            <ChevronUp className="w-3.5 h-3.5 text-gold-muted group-hover:text-gold-primary transition-colors" />
                        ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-gold-muted group-hover:text-gold-primary transition-colors" />
                        )}
                    </div>
                </button>
            </div>

            <div className={`transition-all duration-500 overflow-hidden ${showLexicon ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-2.5 px-1 sm:grid-cols-2 sm:px-2 lg:grid-cols-3">
                    {words?.map((word, index) => (
                        <div key={`${word.s}-${index}`} className="group relative overflow-hidden rounded-2xl border border-gold-primary/10 bg-white/72 px-4 py-3 shadow-sm backdrop-blur-sm dark:border-dark-border/50 dark:bg-dark-bg/42">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                            <span className="mb-1 block font-crimson text-[16px] font-bold text-text-primary dark:text-dark-text-primary">{word.s}</span>
                            <span className="font-inter text-[13px] leading-relaxed text-text-secondary dark:text-dark-text-secondary break-keep">{word.m.trim()}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default VerseLexiconSection;
