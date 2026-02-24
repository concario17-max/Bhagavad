import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const ReflectionsModal = ({ isOpen, onClose }) => {
    const [notesData, setNotesData] = useState([]);

    useEffect(() => {
        if (!isOpen) return;

        // Fetch gita.json to match sanskrit text with saved notes
        fetch('/gita.json')
            .then(res => res.json())
            .then(data => {
                const noteKeys = Object.keys(localStorage).filter(key => key.startsWith('gita-note-'));

                // Sort keys chronologically
                noteKeys.sort((a, b) => {
                    const [, , chA, vA] = a.split('-');
                    const [, , chB, vB] = b.split('-');
                    if (parseInt(chA) !== parseInt(chB)) return parseInt(chA) - parseInt(chB);
                    return parseInt(vA) - parseInt(vB);
                });

                const loadedNotes = [];

                noteKeys.forEach(key => {
                    const [, , ch, v] = key.split('-');
                    const content = localStorage.getItem(key);

                    if (content && content.trim()) {
                        // Find sanskrit text
                        let sanskritText = "";
                        const chapterData = data[ch];
                        if (chapterData && chapterData.verses) {
                            const verseData = chapterData.verses.find(verse => verse.verse.toString() === v);
                            if (verseData && verseData.sanskrit) {
                                // Just grab the first phrase/line of sanskrit for the header, or the whole thing if short
                                sanskritText = verseData.sanskrit.split('\n')[1] || verseData.sanskrit.split('।')[0] + '।';
                                if (!sanskritText.trim()) sanskritText = verseData.sanskrit.substring(0, 50) + "...";
                            }
                        }

                        loadedNotes.push({
                            id: key,
                            chapter: ch,
                            verse: v,
                            sanskrit: sanskritText.trim(),
                            content: content.trim()
                        });
                    }
                });

                setNotesData(loadedNotes);
            })
            .catch(err => console.error("Failed to load gita data for reflections:", err));

    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity duration-300 font-serif">
            {/* Modal Container */}
            <div className="relative w-full max-w-3xl bg-[#FDFBF7] dark:bg-dark-surface border border-gold-border rounded-lg shadow-2xl flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gold-border/30">
                    <h2 className="text-2xl sm:text-3xl text-[#A68B5C] tracking-wide font-medium">
                        My Reflections
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
                <div className="flex-1 overflow-y-auto px-4 sm:px-8 pt-6 pb-10 custom-scrollbar scroll-smooth">

                    {notesData.length === 0 ? (
                        <div className="text-center py-12 text-[#A68B5C]/60 italic">
                            No reflections saved yet. Read a verse and save your thoughts.
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {notesData.map((note) => (
                                <div
                                    key={note.id}
                                    className="bg-white dark:bg-[#1C1C1E] border border-[#E5E0D8] dark:border-[#333] rounded-md p-5 sm:p-6 shadow-sm flex flex-col"
                                >
                                    <div className="flex flex-wrap items-baseline gap-3 mb-4 pb-4 border-b border-[#E5E0D8]/40 dark:border-[#333]/50">
                                        <span className="px-2 py-1 bg-[#F5EFE6] dark:bg-[#2C2C2E] text-[#A68B5C] dark:text-[#D4AF37] text-[10px] sm:text-[11px] font-bold tracking-[0.15em] uppercase rounded-sm whitespace-nowrap">
                                            VERSE {note.chapter}.{note.verse}
                                        </span>
                                        <span className="font-noto text-[#A68B5C] dark:text-[#EAE5D9] text-[15px] sm:text-base tracking-wide leading-snug drop-shadow-sm">
                                            {note.sanskrit}
                                        </span>
                                    </div>
                                    <div className="text-[#5B7282] dark:text-[#A0AEC0] font-noto-kr text-[14px] sm:text-[15px] leading-relaxed whitespace-pre-wrap break-keep">
                                        {note.content}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReflectionsModal;
