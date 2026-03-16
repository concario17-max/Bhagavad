import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Play, Pause, ChevronRight, ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { fetchGitaData } from '../utils/dataFetcher';
import { scrollAppContainerToTop, withBasePath } from '../utils/paths';
import { GitaData, GitaVerse } from '../types';
import { STORAGE_KEYS, getBoolean, setBoolean } from '../utils/storage';
import { getVerseRange, resolveVerse } from '../utils/verse';
import { ContentReader } from '../components/ui/ContentReader';

const formatTime = (time: number): string => {
    if (Number.isNaN(time)) {
        return '0:00';
    }

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const VerseView = () => {
    const { chapterNum, verseNum } = useParams<{ chapterNum: string; verseNum: string }>();
    const navigate = useNavigate();
    const [verseData, setVerseData] = useState<GitaVerse | null>(null);
    const [allChapters, setAllChapters] = useState<GitaData | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showLexicon, setShowLexicon] = useState<boolean>(() => getBoolean(STORAGE_KEYS.showLexicon, false));
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        setBoolean(STORAGE_KEYS.showLexicon, showLexicon);
    }, [showLexicon]);

    useEffect(() => {
        if (!chapterNum || !verseNum) {
            return;
        }

        fetchGitaData()
            .then((data: GitaData) => {
                setAllChapters(data);
                const resolvedVerse = resolveVerse(data, chapterNum, verseNum);

                if (!resolvedVerse) {
                    const chapter = data[chapterNum];
                    if (!chapter) {
                        console.warn(`Chapter ${chapterNum} not found`);
                    } else {
                        console.warn(`Verse ${verseNum} not found in Chapter ${chapterNum}`);
                    }
                    return;
                }

                setVerseData(resolvedVerse);

                const targetVerseNumber = Number.parseInt(verseNum, 10);
                if (resolvedVerse.verse !== targetVerseNumber) {
                    navigate(`/chapter/${chapterNum}/verse/${resolvedVerse.verse}`, { replace: true });
                }
            })
            .catch(err => console.error('Failed to load verse data:', err));
    }, [chapterNum, verseNum, navigate]);

    useEffect(() => {
        scrollAppContainerToTop();
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);

        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    }, [chapterNum, verseNum]);

    const getAudioSrc = (remoteUrl?: string): string | undefined => {
        if (!remoteUrl) {
            return undefined;
        }

        const filename = remoteUrl.split('/').pop();
        return filename ? withBasePath(`mp3/${filename}`) : undefined;
    };

    const togglePlay = (): void => {
        const audioElement = audioRef.current;
        if (!audioElement) {
            return;
        }

        if (isPlaying) {
            audioElement.pause();
        } else {
            void audioElement.play();
        }

        setIsPlaying(!isPlaying);
    };

    const handlePrev = (): void => {
        if (!allChapters || !verseData || !chapterNum) {
            return;
        }

        const currentChapterNumber = Number.parseInt(chapterNum, 10);
        const currentChapter = allChapters[currentChapterNumber.toString()];
        const currentIndex = currentChapter.verses.findIndex(verse => verse.verse === verseData.verse);

        if (currentIndex > 0) {
            const prevVerse = currentChapter.verses[currentIndex - 1];
            navigate(`/chapter/${currentChapterNumber}/verse/${prevVerse.verse}`);
            return;
        }

        if (currentChapterNumber > 1) {
            const prevChapter = allChapters[(currentChapterNumber - 1).toString()];
            const lastVerse = prevChapter.verses[prevChapter.verses.length - 1];
            navigate(`/chapter/${currentChapterNumber - 1}/verse/${lastVerse.verse}`);
        }
    };

    const handleNext = (): void => {
        if (!allChapters || !verseData || !chapterNum) {
            return;
        }

        const currentChapterNumber = Number.parseInt(chapterNum, 10);
        const currentChapter = allChapters[currentChapterNumber.toString()];
        const currentIndex = currentChapter.verses.findIndex(verse => verse.verse === verseData.verse);

        if (currentIndex < currentChapter.verses.length - 1) {
            const nextVerse = currentChapter.verses[currentIndex + 1];
            navigate(`/chapter/${currentChapterNumber}/verse/${nextVerse.verse}`);
            return;
        }

        if (currentChapterNumber < Object.keys(allChapters).length) {
            const nextChapter = allChapters[(currentChapterNumber + 1).toString()];
            const firstVerse = nextChapter.verses[0];
            navigate(`/chapter/${currentChapterNumber + 1}/verse/${firstVerse.verse}`);
        }
    };

    if (!verseData || !allChapters || !chapterNum) {
        return <div className="min-h-screen flex items-center justify-center bg-gold-bg dark:bg-dark-bg"><div className="w-8 h-8 border-4 border-gold-primary border-t-transparent rounded-full animate-spin"></div></div>;
    }

    const currentChapter = allChapters[chapterNum];
    const currentChapterNumber = Number.parseInt(chapterNum, 10);
    const currentVerseNumber = Number.parseInt(verseNum || `${verseData.verse}`, 10);

    const verseRange = getVerseRange(currentChapter, verseData);
    const progressPercent = duration ? (currentTime / duration) * 100 : 0;

    return (
        <ContentReader
            header={
                <>
                    <nav className="flex items-center gap-2 text-[13px] text-text-secondary dark:text-dark-text-secondary font-inter mb-6">
                        <Link to="/" className="hover:text-gold-primary dark:hover:text-gold-light transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-text-primary dark:text-dark-text-primary font-bold">Chapter {chapterNum}, Verse {verseRange}</span>
                    </nav>

                    <div className="w-8 h-8 rounded-full bg-gold-border/20 flex items-center justify-center mb-2 text-gold-primary">
                        <span className="font-serif leading-none">ॐ</span>
                    </div>
                </>
            }
            footer={
                <div className="flex items-center justify-between bg-white/40 dark:bg-dark-surface/40 backdrop-blur-md border border-gold-primary/20 dark:border-dark-border/50 rounded-full px-3 py-1.5 shadow-sm min-w-[180px] hover:shadow-md transition-shadow">
                    <button
                        onClick={handlePrev}
                        disabled={currentChapterNumber === 1 && currentVerseNumber === 1}
                        className="p-2 rounded-full hover:bg-gold-surface/50 dark:hover:bg-[#222] transition-colors disabled:opacity-30 disabled:cursor-not-allowed group text-[#5B7282] dark:text-dark-text-secondary"
                    >
                        <ChevronLeft className="w-5 h-5 group-hover:scale-110 transition-transform stroke-[1.5]" />
                    </button>

                    <span className="text-[15px] font-bold text-[#1C2B36] dark:text-dark-text-primary tracking-wide px-4">
                        {chapterNum}.{verseRange}
                    </span>

                    <button
                        onClick={handleNext}
                        disabled={currentChapterNumber === 18 && currentVerseNumber === 78}
                        className="p-2 rounded-full hover:bg-gold-surface/50 dark:hover:bg-[#222] transition-colors disabled:opacity-30 disabled:cursor-not-allowed group text-[#5B7282] dark:text-dark-text-secondary"
                    >
                        <ChevronRight className="w-5 h-5 group-hover:scale-110 transition-transform stroke-[1.5]" />
                    </button>
                </div>
            }
        >
            <section className="mb-4 text-center px-2 sm:px-0">
                <p className="font-noto text-[#8C3A3A] dark:text-[#E8A586] text-xl sm:text-2xl leading-normal whitespace-pre-line tracking-wide font-bold drop-shadow-sm">
                    {verseData.sanskrit}
                </p>
            </section>

            <section className="mb-2 text-center flex flex-col items-center">
                <p className="font-noto italic text-[#B0A084] dark:text-[#D4C3A3] text-[14px] leading-snug whitespace-pre-line tracking-[0.15em] uppercase mb-1 drop-shadow-sm">
                    {verseData.iast}
                </p>
            </section>

            {verseData.korean_pronunciation && (
                <section className="mb-12 text-center">
                    <p className="font-noto-kr italic text-[#B0A084] dark:text-[#D4C3A3] text-[14px] leading-relaxed whitespace-pre-line tracking-[0.15em] drop-shadow-sm">
                        {verseData.korean_pronunciation}
                    </p>
                </section>
            )}

            <div className="mb-16 flex justify-center">
                <audio
                    ref={audioRef}
                    src={getAudioSrc(verseData.audio)}
                    onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime ?? 0)}
                    onLoadedMetadata={() => setDuration(audioRef.current?.duration ?? 0)}
                    onEnded={() => {
                        setIsPlaying(false);
                        setCurrentTime(0);
                    }}
                    className="hidden"
                />
                <div className="flex items-center justify-between w-full max-w-[400px] rounded-full border border-gold-primary/20 dark:border-dark-border/50 bg-white/40 dark:bg-[#111]/40 backdrop-blur-md px-5 py-2.5 shadow-sm hover:shadow-md transition-all hover:border-gold-primary/40">
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

                    <div
                        className="relative flex-1 mx-4 h-[2px] bg-gold-border/30 dark:bg-dark-border rounded-full cursor-pointer group"
                        onClick={event => {
                            if (!audioRef.current || duration === 0) {
                                return;
                            }

                            const rect = event.currentTarget.getBoundingClientRect();
                            const offset = event.clientX - rect.left;
                            const percentage = offset / rect.width;
                            audioRef.current.currentTime = percentage * duration;
                        }}
                    >
                        <div className="absolute top-0 left-0 h-full bg-[#A68B5C] transition-all" style={{ width: `${progressPercent}%` }}></div>
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

            <section className="mb-16">
                <div className="flex items-center justify-center mb-6">
                    <button
                        onClick={() => setShowLexicon(!showLexicon)}
                        className="group flex flex-col items-center gap-1.5 focus:outline-none"
                    >
                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-muted dark:text-gold-muted group-hover:text-gold-primary transition-colors font-inter">
                            Word-by-word
                        </span>
                        <div className="w-6 h-6 rounded-full border border-gold-primary/20 bg-white/20 dark:bg-dark-surface/20 flex items-center justify-center group-hover:border-gold-primary/50 transition-colors">
                            {showLexicon ? (
                                <ChevronUp className="w-3.5 h-3.5 text-gold-muted group-hover:text-gold-primary transition-colors" />
                            ) : (
                                <ChevronDown className="w-3.5 h-3.5 text-gold-muted group-hover:text-gold-primary transition-colors" />
                            )}
                        </div>
                    </button>
                </div>

                <div className={`transition-all duration-500 overflow-hidden ${showLexicon ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 w-full max-w-4xl mx-auto px-2 sm:px-4">
                        {verseData.words?.map((word, index) => (
                            <div key={`${word.s}-${index}`} className="flex flex-col px-3 py-2 rounded-xl bg-white/30 dark:bg-dark-bg/40 backdrop-blur-sm border border-gold-primary/10 dark:border-dark-border/50 shadow-sm relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                                <span className="font-bold text-text-primary dark:text-dark-text-primary text-[15px] font-crimson mb-0.5">{word.s}</span>
                                <span className="text-text-secondary dark:text-dark-text-secondary text-[13px] font-inter leading-relaxed break-keep">{word.m.trim()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

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
                        <h3 className="text-xs font-semibold uppercase tracking-widest text-gold-primary/70 dark:text-gold-light/60 text-center mb-3 font-inter">Ham translation</h3>
                        <p className="font-noto-kr text-base sm:text-lg leading-loose text-text-primary dark:text-dark-text-primary min-h-[1.5em] text-center max-w-3xl mx-auto px-2 sm:px-0 whitespace-pre-line break-keep">
                            {verseData.translation_ham}
                        </p>
                    </div>
                )}

                {verseData.translation_gil && (
                    <div className="mb-8">
                        <h3 className="text-xs font-semibold uppercase tracking-widest text-gold-primary/70 dark:text-gold-light/60 text-center mb-3 font-inter">Gil translation</h3>
                        <p className="font-noto-kr text-base sm:text-lg leading-loose text-text-primary dark:text-dark-text-primary min-h-[1.5em] text-center max-w-3xl mx-auto px-2 sm:px-0 whitespace-pre-line break-keep">
                            {verseData.translation_gil}
                        </p>
                    </div>
                )}

                {verseData.translation_jimong && (
                    <div className="mb-4">
                        <h3 className="text-xs font-semibold uppercase tracking-widest text-gold-primary/70 dark:text-gold-light/60 text-center mb-3 font-inter">Jimong translation</h3>
                        <p className="font-noto-kr text-base sm:text-lg leading-loose text-text-primary dark:text-dark-text-primary min-h-[1.5em] text-center max-w-3xl mx-auto px-2 sm:px-0 whitespace-pre-line break-keep">
                            {verseData.translation_jimong}
                        </p>
                    </div>
                )}

                {verseData.translation_suk && (
                    <div className="mb-4">
                        <h3 className="text-xs font-semibold uppercase tracking-widest text-gold-primary/70 dark:text-gold-light/60 text-center mb-3 font-inter">Suk translation</h3>
                        <p className="font-noto-kr text-base sm:text-lg leading-loose text-text-primary dark:text-dark-text-primary min-h-[1.5em] text-center max-w-3xl mx-auto px-2 sm:px-0 whitespace-pre-line break-keep">
                            {verseData.translation_suk}
                        </p>
                    </div>
                )}
            </section>

        </ContentReader>
    );
};

export default VerseView;
