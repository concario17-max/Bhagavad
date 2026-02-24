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
        // Scroll to top of the page when navigating to a new verse
        window.scrollTo(0, 0);

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

    if (!verseData || !allChapters) return <div className="min-h-screen flex items-center justify-center bg-gold-bg dark:bg-dark-bg"><div className="w-8 h-8 border-4 border-gold-primary border-t-transparent rounded-full animate-spin"></div></div>;

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
        <div className="min-h-screen bg-gold-bg font-crimson dark:bg-dark-bg text-text-primary dark:text-dark-text-primary transition-colors duration-500">
            <div className="mx-auto max-w-[1000px] px-4 pb-24 pt-6 sm:px-6">
                {/* Verse Heading / Breadcrumbs (Centered) */}
                <div className="flex flex-col items-center justify-center mb-2 pt-4">
                    <nav className="flex items-center gap-2 text-[13px] text-text-secondary dark:text-dark-text-secondary font-inter mb-6">
                        <Link to="/" className="hover:text-gold-primary dark:hover:text-gold-light transition-colors">Chapter {chapterNum}</Link>
                        <span>›</span>
                        <span className="text-text-primary dark:text-dark-text-primary font-bold">Sutra {verseRange}</span>
                    </nav>

                    {/* Top small icon above Sanskrit */}
                    <div className="w-8 h-8 rounded-full bg-gold-border/20 flex items-center justify-center mb-2 text-gold-primary">
                        <span className="font-serif leading-none">֍</span>
                    </div>
                </div>

                {/* Sanskrit */}
                <section className="mb-4 text-center px-2 sm:px-0">
                    <p className="font-noto text-[#1F2937] dark:text-[#E5E7EB] text-xl sm:text-2xl leading-normal whitespace-pre-line tracking-wide font-bold drop-shadow-sm">
                        {verseData.sanskrit}
                    </p>
                </section>

                {/* Transliteration */}
                <section className="mb-5 text-center text-text-secondary/80 dark:text-dark-text-secondary/80 flex flex-col items-center">
                    <p className="font-noto italic text-[15px] leading-snug whitespace-pre-line tracking-wide mb-2">
                        {verseData.iast}
                    </p>
                    <div className="w-8 h-[1px] bg-gold-border/60 my-2"></div>
                </section>

                {/* Korean Pronunciation */}
                {verseData.korean_pronunciation && (
                    <section className="mb-12 text-center text-text-secondary/60 dark:text-dark-text-secondary/60">
                        <p className="font-noto-kr italic text-[15px] leading-relaxed whitespace-pre-line tracking-[0.1em]">
                            {verseData.korean_pronunciation}
                        </p>
                    </section>
                )}

                {/* Clean Pill Audio Player */}
                <div className="mb-16 flex justify-center">
                    <audio
                        ref={audioRef}
                        src={getAudioSrc(verseData.audio)}
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
                        onEnded={handleAudioEnded}
                        className="hidden"
                    />
                    <div className="flex items-center justify-between w-full max-w-[400px] rounded-full border border-gold-border/60 dark:border-[#333] bg-white dark:bg-[#111] px-5 py-2.5 shadow-sm transition-all hover:border-gold-primary/30">
                        <button
                            onClick={togglePlay}
                            disabled={!verseData.audio}
                            className={`text-gold-primary dark:text-gold-light hover:scale-110 transition-transform ${!verseData.audio ? 'opacity-30 cursor-not-allowed hidden' : ''}`}
                        >
                            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                        </button>

                        <span className="text-[10px] text-text-secondary/50 font-inter font-bold tracking-widest tabular-nums ml-4">
                            {formatTime(currentTime)}
                        </span>

                        <div className="relative flex-1 mx-4 h-[2px] bg-gold-border/30 dark:bg-dark-border rounded-full cursor-pointer group"
                            onClick={(e) => {
                                if (!audioRef.current) return;
                                const rect = e.currentTarget.getBoundingClientRect();
                                const x = e.clientX - rect.left;
                                const percentage = x / rect.width;
                                audioRef.current.currentTime = percentage * duration;
                            }}>
                            <div
                                className="absolute top-0 left-0 h-full bg-[#A68B5C] transition-all"
                                style={{ width: `${progressPercent}%` }}
                            ></div>
                            {/* Dragger circle that appears on hover */}
                            <div
                                className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-[#A68B5C] rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                style={{ left: `calc(${progressPercent}% - 4px)` }}
                            ></div>
                        </div>

                        <span className="text-[10px] text-text-secondary/50 font-inter font-bold tracking-widest tabular-nums">
                            {formatTime(duration)}
                        </span>
                    </div>
                </div>

                {/* Word Meanings (Card Grid Style) */}
                <section className="mb-16">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 w-full max-w-4xl mx-auto px-2 sm:px-4">
                        {verseData.words?.map((word, i) => {
                            const cleanMeaning = word.m.replace(/^—\s*/, '').trim();
                            return (
                                <div key={i} className="flex flex-col px-3 py-2 rounded-xl bg-white/40 dark:bg-[#1a1a1a]/40 border border-gold-border/30 dark:border-[#222]">
                                    <span className="font-bold text-text-primary dark:text-dark-text-primary text-[15px] font-crimson mb-0.5">{word.s}</span>
                                    <span className="text-text-secondary dark:text-dark-text-secondary text-[13px] font-inter leading-relaxed break-keep">{cleanMeaning}</span>
                                </div>
                            );
                        })}
                    </div>
                </section>





                {/* Translation */}
                <section className="mb-10">
                    <div className="flex items-center justify-center mb-6">
                        <span className="text-gold-muted/40 dark:text-gold-muted/30 tracking-[8px] text-xs">•••</span>
                    </div>
                    <h2 className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-gold-muted dark:text-gold-muted text-center font-inter">Translation</h2>

                    {verseData.translation_en && (
                        <div className="mb-8">
                            <h3 className="text-xs font-semibold uppercase tracking-widest text-gold-primary/70 dark:text-gold-light/60 text-center mb-3 font-inter">English</h3>
                            <p className="text-base sm:text-lg leading-loose text-text-primary dark:text-dark-text-primary font-inter min-h-[1.5em] text-center max-w-3xl mx-auto px-2 sm:px-0 whitespace-pre-line break-keep">
                                {verseData.translation_en}
                            </p>
                        </div>
                    )}

                    {verseData.translation_ham && (
                        <div className="mb-8">
                            <h3 className="text-xs font-semibold uppercase tracking-widest text-gold-primary/70 dark:text-gold-light/60 text-center mb-3 font-inter">함석헌 역</h3>
                            <p className="font-noto-kr text-base sm:text-lg leading-loose text-text-primary dark:text-dark-text-primary min-h-[1.5em] text-center max-w-3xl mx-auto px-2 sm:px-0 whitespace-pre-line break-keep">
                                {verseData.translation_ham}
                            </p>
                        </div>
                    )}

                    {verseData.translation_gil && (
                        <div className="mb-4">
                            <h3 className="text-xs font-semibold uppercase tracking-widest text-gold-primary/70 dark:text-gold-light/60 text-center mb-3 font-inter">길희성 역</h3>
                            <p className="font-noto-kr text-base sm:text-lg leading-loose text-text-primary dark:text-dark-text-primary min-h-[1.5em] text-center max-w-3xl mx-auto px-2 sm:px-0 whitespace-pre-line break-keep">
                                {verseData.translation_gil}
                            </p>
                        </div>
                    )}
                </section>

                {/* Commentary */}
                <section className="mb-12">
                    <div className="flex items-center justify-center mb-6">
                        <span className="text-gold-muted/40 dark:text-gold-muted/30 tracking-[8px] text-xs">•••</span>
                    </div>
                    <h2 className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-gold-muted dark:text-gold-muted text-center font-inter">Commentary</h2>
                    <div className="text-base sm:text-lg leading-loose text-text-secondary dark:text-dark-text-secondary space-y-4 font-inter min-h-[1.5em] max-w-2xl mx-auto px-2 sm:px-0">
                    </div>
                </section>

                {/* Navigation (Floating Pill Style) */}
                <div className="mt-16 pb-8 flex justify-center font-inter">
                    <div className="flex items-center justify-between bg-[#FDFBF7] dark:bg-[#111] border border-gold-border/40 dark:border-[#333] rounded-full px-3 py-1.5 shadow-sm min-w-[180px]">
                        <button
                            onClick={handlePrev}
                            disabled={parseInt(chapterNum) === 1 && parseInt(verseNum) === 1}
                            className="p-2 rounded-full hover:bg-gold-surface/50 dark:hover:bg-[#222] transition-colors disabled:opacity-30 disabled:cursor-not-allowed group text-[#5B7282] dark:text-dark-text-secondary"
                        >
                            <ChevronLeft className="w-5 h-5 group-hover:scale-110 transition-transform stroke-[1.5]" />
                        </button>

                        <span className="text-[15px] font-bold text-[#1C2B36] dark:text-dark-text-primary tracking-wide px-4">
                            {chapterNum}.{verseRange}
                        </span>

                        <button
                            onClick={handleNext}
                            disabled={parseInt(chapterNum) === 18 && parseInt(verseNum) === 78}
                            className="p-2 rounded-full hover:bg-gold-surface/50 dark:hover:bg-[#222] transition-colors disabled:opacity-30 disabled:cursor-not-allowed group text-[#5B7282] dark:text-dark-text-secondary"
                        >
                            <ChevronRight className="w-5 h-5 group-hover:scale-110 transition-transform stroke-[1.5]" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerseView;
