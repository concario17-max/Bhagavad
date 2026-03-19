import { X } from 'lucide-react';

interface CompendiumModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CompendiumModal = ({ isOpen, onClose }: CompendiumModalProps) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity duration-300">
            <div className="relative w-full max-w-2xl bg-[#FDFBF7] dark:bg-dark-surface border border-gold-border rounded-lg shadow-2xl flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gold-border/30">
                    <h2 className="text-xl sm:text-2xl font-serif text-gold-primary tracking-wide">Compendium</h2>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 text-gold-primary hover:bg-gold-surface dark:hover:bg-dark-bg rounded-full transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
                    <div className="prose prose-[#5B7282] dark:prose-invert max-w-none text-[15px] sm:text-base leading-relaxed">
                        <p>
                            Bhagavad Gita is presented here as a reading-focused archive. The home screen helps readers enter by chapter,
                            while each verse page combines source text, transliteration, translations, audio, and commentary.
                        </p>
                        <p>
                            The project favors a calm reading flow over a complex application shell. Most content is loaded from local static files,
                            which keeps navigation quick and predictable once the app is open.
                        </p>
                        <div className="bg-[#F5EFE6] dark:bg-[#222] border-l-4 border-gold-primary p-5 my-8 rounded-r-md">
                            <h3 className="font-bold text-[#1C2B36] dark:text-gold-light mb-2">How to use it</h3>
                            <p className="text-[#5B7282] m-0">
                                Start from the chapter grid, open a verse, use the side navigation to move through the text,
                                and open the commentary panel when you want additional context while reading.
                            </p>
                        </div>
                        <ul className="list-disc pl-5 space-y-3 mb-0 text-[#5B7282] marker:text-gold-primary">
                            <li>Open a chapter from the home page.</li>
                            <li>Move between verses with the left navigation or footer controls.</li>
                            <li>Expand the word-by-word section when you need lexical context.</li>
                            <li>Use the commentary panel to keep supporting context beside the verse.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompendiumModal;
