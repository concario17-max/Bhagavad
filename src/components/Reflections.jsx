import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Download, Save, Edit3, ChevronUp, ChevronDown, X } from 'lucide-react';
import { useUI } from '../context/UIContext';

const Reflections = () => {
    const { chapterNum, verseNum } = useParams();
    const [note, setNote] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [showReflectionContent, setShowReflectionContent] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('gita-show-reflections');
            if (saved !== null) {
                return JSON.parse(saved);
            }
        }
        return true;
    });
    const { isReflectionsOpen, setIsReflectionsOpen } = useUI();

    const noteKey = `gita-note-${chapterNum}-${verseNum}`;

    useEffect(() => {
        localStorage.setItem('gita-show-reflections', JSON.stringify(showReflectionContent));
    }, [showReflectionContent]);

    useEffect(() => {
        const savedNote = localStorage.getItem(noteKey);
        if (savedNote) {
            setNote(savedNote);
        } else {
            setNote('');
        }
    }, [chapterNum, verseNum, noteKey]);

    const handleSave = () => {
        setIsSaving(true);
        localStorage.setItem(noteKey, note);
        setTimeout(() => setIsSaving(false), 1000);
    };

    const handleExportCurrent = () => {
        const element = document.createElement("a");
        const file = new Blob([note], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `Bhagavad_Gita_Reflection_${chapterNum}_${verseNum}.txt`;
        document.body.appendChild(element);
        element.click();
        setShowExportMenu(false);
    };

    const handleExportAll = () => {
        let allNotesText = `Bhagavad Gita - All Reflections\n\n`;
        const noteKeys = Object.keys(localStorage).filter(key => key.startsWith('gita-note-'));

        // Sort keys logically by chapter then verse
        noteKeys.sort((a, b) => {
            const [, , chA, vA] = a.split('-');
            const [, , chB, vB] = b.split('-');
            if (parseInt(chA) !== parseInt(chB)) return parseInt(chA) - parseInt(chB);
            return parseInt(vA) - parseInt(vB);
        });

        noteKeys.forEach(key => {
            const [, , ch, v] = key.split('-');
            const content = localStorage.getItem(key);
            if (content && content.trim()) {
                allNotesText += `--- Chapter ${ch}, Verse ${v} ---\n${content}\n\n`;
            }
        });

        if (allNotesText === `Bhagavad Gita - All Reflections\n\n`) {
            alert("No saved reflections found to export.");
            return;
        }

        const element = document.createElement("a");
        const file = new Blob([allNotesText], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `Bhagavad_Gita_All_Reflections.txt`;
        document.body.appendChild(element);
        element.click();
        setShowExportMenu(false);
    };

    if (!chapterNum || !verseNum) return null;

    return (
        <>
            {/* Mobile Backdrop */}
            {isReflectionsOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity duration-300"
                    onClick={() => setIsReflectionsOpen(false)}
                />
            )}
            <aside className={`fixed inset-y-0 right-0 z-50 w-[90vw] sm:w-[400px] bg-white/40 dark:bg-dark-surface/40 backdrop-blur-md border-l border-gold-primary/20 dark:border-dark-border/50 h-full lg:h-[calc(100vh-64px)] lg:sticky lg:top-16 transform transition-transform duration-300 lg:translate-x-0 ${isReflectionsOpen ? 'translate-x-0 overflow-hidden shadow-2xl lg:shadow-none' : 'translate-x-full'} flex flex-col font-inter`}>

                {/* Mobile Close Button */}
                <div className="lg:hidden absolute top-4 right-4 z-50">
                    <button onClick={() => setIsReflectionsOpen(false)} className="p-2 rounded-full hover:bg-gold-surface dark:hover:bg-dark-surface text-text-secondary dark:text-dark-text-secondary transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 relative flex flex-col h-full min-h-0">
                    <button
                        onClick={() => setShowReflectionContent(!showReflectionContent)}
                        className="w-full flex items-center justify-between mb-6 shrink-0 border-b border-gold-border/30 pb-4 group focus:outline-none"
                    >
                        <div className="flex items-center gap-2">
                            <Edit3 className="w-5 h-5 text-[#A68B5C] dark:text-gold-light group-hover:text-gold-primary transition-colors" />
                            <h2 className="text-sm font-bold text-[#1C2B36] dark:text-dark-text-primary tracking-wide group-hover:text-gold-primary transition-colors">통찰 기록 (Reflections)</h2>
                        </div>
                        {showReflectionContent ? (
                            <ChevronUp className="w-4 h-4 text-text-secondary/50 group-hover:text-gold-primary transition-colors" />
                        ) : (
                            <ChevronDown className="w-4 h-4 text-text-secondary/50 group-hover:text-gold-primary transition-colors" />
                        )}
                    </button>

                    <div className={`flex-1 flex flex-col min-h-0 transition-all duration-300 overflow-hidden ${showReflectionContent ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="mb-4 flex-1 flex flex-col min-h-0 space-y-2">
                            <div className="text-xs font-bold text-[#8FA0AD] tracking-wider">
                                {chapterNum}.{verseNum}
                            </div>

                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="수트라 관점. 개인적 통찰 및 논리 압축 기록 요망."
                                className="flex-1 w-full p-5 rounded-2xl border border-gold-primary/20 dark:border-dark-border/60 bg-white/70 dark:bg-dark-bg/60 text-text-primary dark:text-dark-text-primary focus:outline-none focus:border-gold-primary/50 focus:ring-1 focus:ring-gold-primary/20 shadow-inner backdrop-blur-sm transition-all resize-none font-inter text-[14px] leading-relaxed custom-scrollbar placeholder:text-text-secondary/40 dark:placeholder:text-dark-text-secondary/40"
                            />
                        </div>

                        <div className="flex gap-3 mt-4 relative pt-2">
                            <div className="flex-1 relative">
                                <button
                                    onClick={() => setShowExportMenu(!showExportMenu)}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gold-primary/20 dark:border-dark-border/60 text-text-secondary dark:text-dark-text-secondary hover:bg-gold-surface/60 dark:hover:bg-dark-bg transition-all text-xs font-bold bg-white/60 dark:bg-dark-surface/60 backdrop-blur-sm shadow-sm tracking-wide"
                                >
                                    <Download className="w-3.5 h-3.5" />
                                    Export
                                </button>

                                {showExportMenu && (
                                    <div className="absolute bottom-full left-0 w-full mb-2 bg-white dark:bg-[#111] border border-gold-border/50 dark:border-[#333] rounded-lg shadow-lg overflow-hidden z-20">
                                        <button
                                            onClick={handleExportCurrent}
                                            className="w-full text-left px-4 py-2.5 text-xs font-medium text-text-primary dark:text-dark-text-primary hover:bg-gold-surface dark:hover:bg-[#222] transition-colors border-b border-gold-border/20 dark:border-[#333]"
                                        >
                                            Current Verse
                                        </button>
                                        <button
                                            onClick={handleExportAll}
                                            className="w-full text-left px-4 py-2.5 text-xs font-medium text-text-primary dark:text-dark-text-primary hover:bg-gold-surface dark:hover:bg-[#222] transition-colors"
                                        >
                                            All Verses
                                        </button>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gold-primary hover:bg-gold-muted text-white transition-all text-xs font-bold shadow-md hover:shadow-lg hover:shadow-gold-primary/20 active:scale-95 disabled:opacity-70"
                            >
                                {isSaving ? 'Saving...' : 'Save Note'}
                            </button>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Reflections;
