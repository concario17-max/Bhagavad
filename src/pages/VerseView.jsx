import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Play, Pause, ChevronRight, ChevronLeft } from 'lucide-react';

const VerseView = () => {
    const { chapterNum, verseNum } = useParams();
    const navigate = useNavigate();
    const [verseData, setVerseData] = useState(null);
    const [allChapters, setAllChapters] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef(null);

    useEffect(() => {
        fetch('/gita.json')
            .then(res => res.json())
            .then(data => {
                if (data) {
                    setAllChapters(data);
                    const chapter = data[chapterNum];
                    if (chapter) {
                        const targetVerseNum = parseInt(verseNum);
                        // Find the verse that covers the requested number
                        // Because some verses are grouped (e.g., 4, 5, 6 might all be under verse 4)
                        const verseIndex = chapter.verses.findIndex((v, i, arr) => {
                            const nextV = arr[i + 1];
                            if (nextV) {
                                return v.verse <= targetVerseNum && targetVerseNum < nextV.verse;
                            }
                            // For the last verse, it matches if target is >= verse.verse
                            // But usually we just care about exact or within known range.
                            // Let's just say if it's >= last verse start, it's the last verse.
                            return v.verse <= targetVerseNum;
                        });

                        if (verseIndex !== -1) {
                            const foundVerse = chapter.verses[verseIndex];
                            setVerseData(foundVerse);

                            // If the URL verse number is different from the canonical verse number (e.g. visited 5, found 4),
                            // replace URL to canonical 4.
                            if (foundVerse.verse !== targetVerseNum) {
                                navigate(`/chapter/${chapterNum}/verse/${foundVerse.verse}`, { replace: true });
                            }
                        } else {
                            console.warn(`Verse ${verseNum} not found in Chapter ${chapterNum}`);
                        }
                    } else {
                        console.warn(`Chapter ${chapterNum} not found`);
                    }
                }
            })
            .catch(err => console.error('Failed to load verse data:', err));
    }, [chapterNum, verseNum, navigate]);

    useEffect(() => {
        // Reset audio state when verse changes
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    }, [chapterNum, verseNum]); // Keep this simple, it reacts to URL changes

    const getAudioSrc = (remoteUrl) => {
        if (!remoteUrl) return null;
        const filename = remoteUrl.split('/').pop();
        return `/mp3/${filename}`;
    };

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleAudioEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
    };

    const formatTime = (time) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handlePrev = () => {
        if (!allChapters || !verseData) return;

        const currentC = parseInt(chapterNum);
        const currentChapter = allChapters[currentC];
        const currentIndex = currentChapter.verses.findIndex(v => v.verse === verseData.verse);

        if (currentIndex > 0) {
            // Go to previous verse in the same chapter
            const prevVerse = currentChapter.verses[currentIndex - 1];
            navigate(`/chapter/${currentC}/verse/${prevVerse.verse}`);
        } else if (currentC > 1) {
            // Go to previous chapter's last verse
            const prevChapter = allChapters[currentC - 1];
            const lastVerse = prevChapter.verses[prevChapter.verses.length - 1];
            navigate(`/chapter/${currentC - 1}/verse/${lastVerse.verse}`);
        }
    };

    const handleNext = () => {
        if (!allChapters || !verseData) return;

        const currentC = parseInt(chapterNum);
        const currentChapter = allChapters[currentC];
        const currentIndex = currentChapter.verses.findIndex(v => v.verse === verseData.verse);

        if (currentIndex < currentChapter.verses.length - 1) {
            // Go to next verse in the same chapter
            const nextVerse = currentChapter.verses[currentIndex + 1];
            navigate(`/chapter/${currentC}/verse/${nextVerse.verse}`);
        } else if (currentC < Object.keys(allChapters).length) {
            // Go to next chapter's first verse
            const nextChapter = allChapters[currentC + 1];
            const firstVerse = nextChapter.verses[0];
            navigate(`/chapter/${currentC + 1}/verse/${firstVerse.verse}`);
        }
    };

    if (!verseData || !allChapters) return <div className="min-h-screen flex items-center justify-center bg-prakash-bg dark:bg-nisha-bg"><div className="w-8 h-8 border-4 border-prakash-primary border-t-transparent rounded-full animate-spin"></div></div>;

    const currentChapter = allChapters[chapterNum];
    const totalVerses = currentChapter.verses.length;

    // Calculate display verse range (e.g., 4-6)
    const getVerseRange = () => {
        const idx = currentChapter.verses.findIndex(v => v.verse === verseData.verse);
        const nextV = currentChapter.verses[idx + 1];
        if (nextV && nextV.verse > verseData.verse + 1) {
            return `${verseData.verse}-${nextV.verse - 1}`;
        }
        return verseData.verse;
    };

    const verseRange = getVerseRange();
    const progressPercent = duration ? (currentTime / duration) * 100 : 0;

    return (
        <div className="min-h-screen bg-prakash-bg font-crimson dark:bg-nisha-bg text-gray-900 dark:text-gray-100 transition-colors duration-300">
            <div className="mx-auto max-w-[680px] px-4 pb-24 pt-6 sm:px-6">
                {/* Breadcrumbs */}
                <nav className="mb-6 flex items-center gap-2 text-[13px] text-gray-500 dark:text-gray-400">
                    <Link to="/" className="hover:text-prakash-primary dark:hover:text-nisha-primary transition-colors">Chapters</Link>
                    <span>›</span>
                    <Link to={`/chapter/${chapterNum}/verse/1`} className="hover:text-prakash-primary dark:hover:text-nisha-primary transition-colors">Chapter {chapterNum}</Link>
                    <span>›</span>
                    <span className="text-gray-900 dark:text-gray-100 font-medium">Verse {verseRange}</span>
                </nav>



                {/* Sanskrit */}
                <section className="mb-8 text-center text-prakash-primary dark:text-nisha-primary">
                    <p className="sanskrit-verse whitespace-pre-line leading-loose font-medium">
                        {verseData.sanskrit}
                    </p>
                </section>

                {/* Transliteration */}
                <section className="mb-8 text-center text-gray-600 dark:text-gray-400">
                    <p className="font-noto italic text-base leading-relaxed whitespace-pre-line">
                        {verseData.iast}
                    </p>
                </section>

                {/* Korean Pronunciation */}
                {verseData.korean_pronunciation && (
                    <section className="mb-10 text-center text-gray-800 dark:text-gray-200">
                        <p className="text-xl leading-relaxed whitespace-pre-line font-noto-kr font-medium tracking-wide">
                            {verseData.korean_pronunciation}
                        </p>
                    </section>
                )}

                {/* Audio Player */}
                <div className="mb-12 flex justify-center">
                    <audio
                        ref={audioRef}
                        src={getAudioSrc(verseData.audio)}
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
                        onEnded={handleAudioEnded}
                        className="hidden"
                    />
                    <div className="inline-flex items-center gap-3 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-5 py-2.5 shadow-sm transition-colors">
                        <button
                            onClick={togglePlay}
                            disabled={!verseData.audio}
                            className={`text-gray-600 dark:text-gray-300 hover:text-prakash-primary dark:hover:text-nisha-primary transition-colors ${!verseData.audio ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                        </button>

                        <div className="relative w-48 sm:w-80 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden cursor-pointer"
                            onClick={(e) => {
                                if (!audioRef.current) return;
                                const rect = e.currentTarget.getBoundingClientRect();
                                const x = e.clientX - rect.left;
                                const percentage = x / rect.width;
                                audioRef.current.currentTime = percentage * duration;
                            }}>
                            <div
                                className="absolute top-0 left-0 h-full bg-prakash-primary dark:bg-nisha-primary transition-all duration-100"
                                style={{ width: `${progressPercent}%` }}
                            ></div>
                        </div>

                        <span className="text-xs text-gray-500 font-medium min-w-[60px] text-right">
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                    </div>
                </div>

                {/* Word Meanings */}
                <section className="mb-10">
                    <div className="flex items-center justify-center mb-6">
                        <span className="text-gray-300 dark:text-gray-700 tracking-[6px] text-xs">•••</span>
                    </div>
                    <h2 className="mb-5 text-sm font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 text-center">Word Meanings</h2>
                    <div className="grid grid-cols-1 gap-y-2 md:grid-cols-2 md:gap-x-8 max-w-2xl mx-auto px-4">
                        {verseData.words?.map((word, i) => (
                            <div key={i} className="flex items-baseline gap-2 text-[15px] leading-relaxed border-b border-gray-100 dark:border-gray-800/50 pb-1">
                                <span className="min-w-[100px] italic text-amber-800 dark:text-amber-500 font-crimson font-medium">{word.s}</span>
                                <span className="text-gray-300 dark:text-gray-700 shrink-0">—</span>
                                <span className="flex-1 text-gray-700 dark:text-gray-300 font-inter">{word.m}</span>
                            </div>
                        ))}
                    </div>
                </section>





                {/* Translation */}
                <section className="mb-10">
                    <div className="flex items-center justify-center mb-6">
                        <span className="text-gray-300 dark:text-gray-700 tracking-[6px] text-xs">•••</span>
                    </div>
                    <h2 className="mb-5 text-sm font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">Translation</h2>
                    <p className="text-lg leading-loose text-gray-800 dark:text-gray-200 font-inter min-h-[1.5em]"></p>
                </section>

                {/* Commentary */}
                <section className="mb-12">
                    <div className="flex items-center justify-center mb-6">
                        <span className="text-gray-300 dark:text-gray-700 tracking-[6px] text-xs">•••</span>
                    </div>
                    <h2 className="mb-5 text-sm font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">Commentary</h2>
                    <div className="text-lg leading-loose text-gray-700 dark:text-gray-300 space-y-4 font-inter min-h-[1.5em]">
                    </div>
                </section>

                {/* Navigation */}
                <div className="border-t border-gray-200 dark:border-gray-800 pt-8 mt-12">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={handlePrev}
                            disabled={parseInt(chapterNum) === 1 && parseInt(verseNum) === 1}
                            className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed group text-sm font-medium"
                        >
                            <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                            <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Previous</span>
                        </button>

                        <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                            {verseRange} / {totalVerses}
                        </span>

                        <button
                            onClick={handleNext}
                            disabled={parseInt(chapterNum) === 18 && parseInt(verseNum) === 78}
                            className="flex items-center gap-2 px-6 py-3 bg-prakash-primary dark:bg-nisha-primary text-white dark:text-gray-900 rounded-md shadow-sm hover:opacity-90 transition-all text-sm font-medium"
                        >
                            <span>Next</span>
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerseView;
