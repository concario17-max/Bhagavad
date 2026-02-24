import { useState, useEffect, useMemo } from 'react';
import { X } from 'lucide-react';

const LexiconModal = ({ isOpen, onClose }) => {
    const [lexiconData, setLexiconData] = useState({});

    useEffect(() => {
        if (isOpen && Object.keys(lexiconData).length === 0) {
            fetch('/lexicon.json')
                .then(res => res.json())
                .then(data => setLexiconData(data))
                .catch(err => console.error("Failed to load lexicon data:", err));
        }
    }, [isOpen]);

    const alphabet = "ABCDEFGHIJKLMNOPRSTUVY".split('');

    // Function to scroll to specific letter section
    const scrollToLetter = (letter) => {
        const element = document.getElementById(`lexicon-${letter}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity duration-300 font-serif">
            {/* Modal Container */}
            <div className="relative w-full max-w-3xl bg-[#FDFBF7] dark:bg-dark-surface border border-gold-border rounded-lg shadow-2xl flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gold-border/30">
                    <h2 className="text-2xl sm:text-3xl text-[#A68B5C] tracking-wide font-medium">
                        Lexicon
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 text-[#A68B5C] hover:bg-gold-surface dark:hover:bg-dark-bg rounded-full transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content Body */}
                <div className="flex-1 overflow-y-auto px-4 sm:px-10 pt-6 pb-10 custom-scrollbar scroll-smooth">

                    {/* Alphabet Filter Buttons */}
                    <div className="flex flex-wrap gap-2 mb-12">
                        {alphabet.map((letter) => {
                            const hasWords = lexiconData[letter] && lexiconData[letter].length > 0;
                            return (
                                <button
                                    key={letter}
                                    onClick={() => hasWords && scrollToLetter(letter)}
                                    disabled={!hasWords}
                                    className={`w-8 h-8 flex items-center justify-center text-[13px] rounded-md transition-colors 
                                        ${hasWords
                                            ? 'bg-[#FDFBF7] dark:bg-[#222] text-[#A68B5C] font-bold shadow-sm hover:bg-[#F5EFE6] dark:hover:bg-[#333] cursor-pointer border border-[#E5E0D8] dark:border-[#444]'
                                            : 'bg-transparent text-[#A68B5C]/30 cursor-not-allowed border border-transparent'
                                        }
                                    `}
                                >
                                    {letter}
                                </button>
                            );
                        })}
                    </div>

                    {/* Dictionary List */}
                    <div className="space-y-12">
                        {alphabet.map(letter => {
                            const words = lexiconData[letter];
                            if (!words || words.length === 0) return null;

                            return (
                                <div key={letter} id={`lexicon-${letter}`} className="scroll-mt-6">
                                    <h3 className="text-[#A68B5C] font-bold text-lg mb-6">{letter}</h3>

                                    <div className="flex flex-col">
                                        {words.map((item, idx) => (
                                            <div
                                                key={`${item.word}-${idx}`}
                                                className="flex flex-col sm:flex-row sm:items-baseline py-4 border-b border-[#E5E0D8]/60 dark:border-[#333] last:border-0 hover:bg-gold-surface/20 dark:hover:bg-[#1a1a1a] transition-colors rounded-sm px-2 -mx-2"
                                            >
                                                <div className="w-full sm:w-1/3 mb-1 sm:mb-0">
                                                    <span className="font-bold text-[#A68B5C] tracking-wide text-[15px] uppercase">
                                                        {item.word}
                                                    </span>
                                                </div>
                                                <div className="w-full sm:w-2/3">
                                                    <span className="text-[#5B7282] dark:text-[#a0aec0] font-noto-kr text-[15px] leading-relaxed break-keep">
                                                        {item.meaning}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default LexiconModal;
