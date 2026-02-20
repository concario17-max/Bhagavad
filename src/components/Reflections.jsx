import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Download, Save, MessageSquareText, Edit3 } from 'lucide-react';

const Reflections = () => {
    const { chapterNum, verseNum } = useParams();
    const [note, setNote] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const noteKey = `gita-note-${chapterNum}-${verseNum}`;

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

    const handleExport = () => {
        const element = document.createElement("a");
        const file = new Blob([note], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `Bhagavad_Gita_Reflections_${chapterNum}_${verseNum}.txt`;
        document.body.appendChild(element);
        element.click();
    };

    if (!chapterNum || !verseNum) return null;

    return (
        <aside className="w-96 bg-gray-50 dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 h-[calc(100vh-64px)] sticky top-16 hidden lg:flex flex-col font-inter">
            <div className="p-6">
                <div className="flex items-center gap-2.5 mb-8">
                    <Edit3 className="w-5 h-5 text-amber-700 dark:text-amber-500" />
                    <h2 className="text-lg font-bold text-[#1a365d] dark:text-gray-100">Reflections</h2>
                </div>

                <div className="mb-4">
                    <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
                        NOTES ON SUTRA {chapterNum}.{verseNum}
                    </p>

                    <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="이 수트라에 대한 나만의 단상이나 해석을 기록해보세요..."
                        className="w-full h-[450px] p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 shadow-inner transition-all resize-none font-inter text-sm leading-relaxed"
                    />
                </div>

                <div className="flex gap-3 mt-4">
                    <button
                        onClick={handleExport}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-sm font-semibold bg-white dark:bg-transparent shadow-sm"
                    >
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#b78d4a] hover:bg-[#a67c39] dark:bg-amber-700 dark:hover:bg-amber-800 text-white transition-all text-sm font-semibold shadow-md active:scale-95"
                    >
                        <Save className="w-4 h-4" />
                        {isSaving ? 'Saving...' : 'Save Note'}
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Reflections;
