import { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import LexiconAlphabet from './LexiconAlphabet';
import LexiconItem from './LexiconItem';
import { withBasePath } from '../utils/paths';

interface LexiconModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface LexiconWord {
    word: string;
    meaning: string;
}

type LexiconData = Record<string, LexiconWord[]>;

const LexiconModal = ({ isOpen, onClose }: LexiconModalProps) => {
    const [lexiconData, setLexiconData] = useState<LexiconData>({});
    const [loadState, setLoadState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');

    useEffect(() => {
        if (isOpen && Object.keys(lexiconData).length === 0) {
            setLoadState('loading');
            fetch(withBasePath('lexicon.json'))
                .then(res => res.json())
                .then((data: LexiconData) => {
                    setLexiconData(data);
                    setLoadState('ready');
                })
                .catch(() => {
                    setLoadState('error');
                });
        }
    }, [isOpen, lexiconData]);

    const alphabet = "ABCDEFGHIJKLMNOPRSTUVY".split('');

    const scrollToLetter = useCallback((letter: string) => {
        const element = document.getElementById(`lexicon-${letter}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, []);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-all duration-500 animate-in fade-in">
            {/* Modal Container */}
            <div className="relative w-full max-w-3xl bg-gold-bg dark:bg-dark-surface border border-gold-border/50 rounded-2xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] flex flex-col max-h-[90vh] overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between p-6 sm:p-8 border-b border-gold-border/10 bg-gold-surface/30 dark:bg-dark-bg/30">
                    <div>
                        <h2 className="text-3xl sm:text-4xl text-gold-primary tracking-tighter font-crimson">
                            Lexicon
                        </h2>
                        <p className="text-sm text-gold-muted/70 mt-1 uppercase tracking-widest font-inter">Reference Guide</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 -mr-2 text-gold-primary hover:bg-gold-primary/10 dark:hover:bg-white/5 rounded-full transition-all duration-300 hover:rotate-90"
                        aria-label="Close"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content Body */}
                <div className="flex-1 overflow-y-auto px-6 sm:px-12 pt-8 pb-12 custom-scrollbar scroll-smooth">

                    <LexiconAlphabet
                        alphabet={alphabet}
                        lexiconData={lexiconData}
                        onLetterClick={scrollToLetter}
                    />

                    {loadState === 'error' ? (
                        <div className="rounded-2xl border border-dashed border-gold-primary/20 bg-white/45 px-5 py-8 text-center text-sm leading-relaxed text-text-secondary dark:border-dark-border/50 dark:bg-dark-bg/40 dark:text-dark-text-secondary">
                            Lexicon data could not be loaded from the local source files.
                        </div>
                    ) : (
                        <div className="space-y-16">
                            {alphabet.map(letter => {
                                const words = lexiconData[letter];
                                if (!words || words.length === 0) return null;

                                return (
                                    <div key={letter} id={`lexicon-${letter}`} className="scroll-mt-12 group">
                                        <div className="flex items-center gap-4 mb-8">
                                            <h3 className="text-gold-primary font-crimson italic text-3xl">{letter}</h3>
                                            <div className="h-px flex-1 bg-gradient-to-r from-gold-border/40 to-transparent"></div>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            {words.map((item, idx) => (
                                                <LexiconItem
                                                    key={`${item.word}-${idx}`}
                                                    word={item.word}
                                                    meaning={item.meaning}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default LexiconModal;
