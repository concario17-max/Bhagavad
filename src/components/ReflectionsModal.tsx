import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { fetchGitaData } from '../utils/dataFetcher';
import { GitaData } from '../types';
import { getAllReflectionNotes } from '../utils/storage';

interface ReflectionsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface ReflectionNote {
    id: string;
    chapter: string;
    verse: string;
    sanskrit: string;
    content: string;
}

const getSanskritPreview = (sanskrit: string): string => {
    const nonEmptyLines = sanskrit
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean);

    if (nonEmptyLines.length > 1) {
        return nonEmptyLines[1];
    }

    if (nonEmptyLines.length === 1) {
        return nonEmptyLines[0];
    }

    return sanskrit.trim().slice(0, 50);
};

const ReflectionsModal = ({ isOpen, onClose }: ReflectionsModalProps) => {
    const [notesData, setNotesData] = useState<ReflectionNote[]>([]);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        fetchGitaData()
            .then((data: GitaData) => {
                const loadedNotes = getAllReflectionNotes().reduce<ReflectionNote[]>((accumulator, noteEntry) => {
                    const { key, chapter, verse, content } = noteEntry;
                    const chapterData = data[chapter];
                    const verseData = chapterData?.verses.find(entry => entry.verse.toString() === verse);
                    const sanskritPreview = verseData?.sanskrit ? getSanskritPreview(verseData.sanskrit) : '';

                    accumulator.push({
                        id: key,
                        chapter,
                        verse,
                        sanskrit: sanskritPreview,
                        content
                    });

                    return accumulator;
                }, []);

                setNotesData(loadedNotes);
            })
            .catch(err => console.error('Failed to load gita data for notes:', err));
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity duration-300 font-serif">
            <div className="relative w-full max-w-3xl bg-[#FDFBF7] dark:bg-dark-surface border border-gold-border rounded-lg shadow-2xl flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gold-border/30">
                    <h2 className="text-2xl sm:text-3xl text-[#A68B5C] tracking-wide font-medium">My Notes</h2>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 text-[#A68B5C] hover:bg-gold-surface dark:hover:bg-dark-bg rounded-full transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 sm:px-8 pt-6 pb-10 custom-scrollbar scroll-smooth">
                    {notesData.length === 0 ? (
                        <div className="text-center py-12 text-[#A68B5C]/60 italic">
                            No notes saved yet. Read a verse and save your thoughts.
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {notesData.map(note => (
                                <div
                                    key={note.id}
                                    className="bg-white dark:bg-[#1C1C1E] border border-[#E5E0D8] dark:border-[#333] rounded-md p-5 sm:p-6 shadow-sm flex flex-col"
                                >
                                    <div className="flex flex-wrap items-baseline gap-3 mb-4 pb-4 border-b border-[#E5E0D8]/40 dark:border-[#333]/50">
                                        <span className="px-2 py-1 bg-[#F5EFE6] dark:bg-[#2C2C2E] text-[#A68B5C] dark:text-[#D4AF37] text-[10px] sm:text-[11px] font-bold tracking-[0.15em] uppercase rounded-sm whitespace-nowrap">
                                            Verse {note.chapter}.{note.verse}
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
