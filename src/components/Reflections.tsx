import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Download, Edit3 } from 'lucide-react';
import { getAllReflectionNotes, getReflectionNote, setReflectionNote } from '../utils/storage';

const Reflections = () => {
    const { chapterNum, verseNum } = useParams<{ chapterNum: string; verseNum: string }>();
    const [note, setNote] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [showExportMenu, setShowExportMenu] = useState(false);

    useEffect(() => {
        if (!chapterNum || !verseNum) {
            return;
        }

        setNote(getReflectionNote(chapterNum, verseNum));
    }, [chapterNum, verseNum]);

    const handleSave = (): void => {
        if (!chapterNum || !verseNum) {
            return;
        }

        setIsSaving(true);
        setReflectionNote(chapterNum, verseNum, note);
        setTimeout(() => setIsSaving(false), 1000);
    };

    const downloadTextFile = (filename: string, content: string): void => {
        const element = document.createElement('a');
        const file = new Blob([content], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = filename;
        document.body.appendChild(element);
        element.click();
        element.remove();
    };

    const handleExportCurrent = (): void => {
        downloadTextFile(`Bhagavad_Gita_Reflection_${chapterNum}_${verseNum}.txt`, note);
        setShowExportMenu(false);
    };

    const handleExportAll = (): void => {
        let allNotesText = 'Bhagavad Gita - All Notes\n\n';
        getAllReflectionNotes().forEach(noteEntry => {
            allNotesText += `--- Chapter ${noteEntry.chapter}, Verse ${noteEntry.verse} ---\n${noteEntry.content}\n\n`;
        });

        if (allNotesText === 'Bhagavad Gita - All Notes\n\n') {
            alert('No saved notes found to export.');
            return;
        }

        downloadTextFile('Bhagavad_Gita_All_Notes.txt', allNotesText);
        setShowExportMenu(false);
    };

    if (!chapterNum || !verseNum) {
        return null;
    }

    return (
        <div className="flex h-full min-h-0 flex-col">
            <div className="mb-6 shrink-0 border-b border-gold-border/30 pb-4">
                <div className="flex items-center gap-2">
                    <Edit3 className="h-5 w-5 text-[#A68B5C] dark:text-gold-light" />
                    <h2 className="text-sm font-bold tracking-wide text-[#1C2B36] dark:text-dark-text-primary">Notes</h2>
                </div>
                <p className="mt-3 text-xs font-bold tracking-wider text-[#8FA0AD]">
                    {chapterNum}.{verseNum}
                </p>
            </div>

            <div className="mb-4 flex min-h-0 flex-1 flex-col space-y-2">
                <textarea
                    value={note}
                    onChange={event => setNote(event.target.value)}
                    placeholder="Write your notes or reading observations for this verse."
                    className="custom-scrollbar flex-1 w-full resize-none rounded-2xl border border-gold-primary/20 bg-white/70 p-5 text-[14px] leading-relaxed text-text-primary shadow-inner backdrop-blur-sm transition-all placeholder:text-text-secondary/40 focus:border-gold-primary/50 focus:outline-none focus:ring-1 focus:ring-gold-primary/20 dark:border-dark-border/60 dark:bg-dark-bg/60 dark:text-dark-text-primary dark:placeholder:text-dark-text-secondary/40"
                />
            </div>

            <div className="relative mt-4 flex gap-3 pt-2">
                <div className="relative flex-1">
                    <button
                        onClick={() => setShowExportMenu(!showExportMenu)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gold-primary/20 dark:border-dark-border/60 text-text-secondary dark:text-dark-text-secondary hover:bg-gold-surface/60 dark:hover:bg-dark-bg transition-all text-xs font-bold bg-white/60 dark:bg-dark-surface/60 backdrop-blur-sm shadow-sm tracking-wide"
                    >
                        <Download className="h-3.5 w-3.5" />
                        Export
                    </button>

                    {showExportMenu && (
                        <div className="absolute bottom-full left-0 z-20 mb-2 w-full overflow-hidden rounded-lg border border-gold-border/50 bg-white shadow-lg dark:border-[#333] dark:bg-[#111]">
                            <button
                                onClick={handleExportCurrent}
                                className="w-full border-b border-gold-border/20 px-4 py-2.5 text-left text-xs font-medium text-text-primary transition-colors hover:bg-gold-surface dark:border-[#333] dark:text-dark-text-primary dark:hover:bg-[#222]"
                            >
                                Current verse
                            </button>
                            <button
                                onClick={handleExportAll}
                                className="w-full px-4 py-2.5 text-left text-xs font-medium text-text-primary transition-colors hover:bg-gold-surface dark:text-dark-text-primary dark:hover:bg-[#222]"
                            >
                                All verses
                            </button>
                        </div>
                    )}
                </div>

                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gold-primary hover:bg-gold-muted text-white transition-all text-xs font-bold shadow-md hover:shadow-lg hover:shadow-gold-primary/20 active:scale-95 disabled:opacity-70"
                >
                    {isSaving ? 'Saving...' : 'Save note'}
                </button>
            </div>
        </div>
    );
};

export default Reflections;
