import React from 'react';

interface LexiconAlphabetProps {
    alphabet: string[];
    lexiconData: Record<string, any[]>;
    onLetterClick: (letter: string) => void;
}

// 알파벳 필터 렌더링 컴포넌트.
const LexiconAlphabet = ({ alphabet, lexiconData, onLetterClick }: LexiconAlphabetProps) => {
    return (
        <div className="flex flex-wrap gap-2 mb-12">
            {alphabet.map((letter) => {
                const hasWords = lexiconData[letter] && lexiconData[letter].length > 0;
                return (
                    <button
                        key={letter}
                        onClick={() => hasWords && onLetterClick(letter)}
                        disabled={!hasWords}
                        className={`w-9 h-9 flex items-center justify-center text-[13px] rounded-full transition-all duration-300 border
                            ${hasWords
                                ? 'bg-gold-bg dark:bg-dark-bg text-gold-primary border-gold-border/30 shadow-sm hover:shadow-md hover:scale-110 hover:border-gold-primary cursor-pointer'
                                : 'bg-transparent text-gold-primary/20 border-transparent cursor-not-allowed opacity-50'
                            }
                        `}
                    >
                        {letter}
                    </button>
                );
            })}
        </div>
    );
};

export default React.memo(LexiconAlphabet);
