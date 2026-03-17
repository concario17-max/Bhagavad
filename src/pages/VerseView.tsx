import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Play, Pause, ChevronRight, ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { fetchGitaData } from '../utils/dataFetcher';
import { scrollAppContainerToTop, withBasePath } from '../utils/paths';
import { GitaData, GitaVerse } from '../types';
import { STORAGE_KEYS, getBoolean, setBoolean } from '../utils/storage';
import { getVerseRange, resolveVerse } from '../utils/verse';
import { ContentReader } from '../components/ui/ContentReader';

interface TranslationSection {
    id: string;
    title: string;
    content: string;
    className: string;
}

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
    const translationSections: TranslationSection[] = [
        { id: 'english', title: 'ENGLISH', content: verseData.translation_en ?? '', className: 'font-inter' },
        { id: 'ham', title: 'HAM', content: verseData.translation_ham ?? '', className: 'font-noto-kr' },
        { id: 'gil', title: 'GIL', content: verseData.translation_gil ?? '', className: 'font-noto-kr' },
        { id: 'jimong', title: 'MYUNG', content: verseData.translation_jimong ?? '', className: 'font-noto-kr' },
        { id: 'suk', title: 'SUK', content: verseData.translation_suk ?? '', className: 'font-noto-kr' }
    ].filter(section => section.content.trim() !== '');

    return (
        <ContentReader
            header={
                <div className="w-full">
                    <nav className="mb-4 flex items-center gap-2 text-[12px] font-inter uppercase tracking-[0.18em] text-text-secondary/70 dark:text-dark-text-secondary/70">
                        <Link to="/" className="hover:text-gold-primary dark:hover:text-gold-light transition-colors">Home</Link>
                        <span>/</span>
                        <span className="font-bold text-text-primary dark:text-dark-text-primary">Chapter {chapterNum}, Verse {verseRange}</span>
                    </nav>
                </div>
            }
            footer={
                <div className="flex items-center justify-between rounded-full border border-gold-primary/15 bg-white/75 px-3 py-1.5 shadow-lg shadow-black/5 backdrop-blur-md transition-shadow hover:shadow-xl dark:border-dark-border/70 dark:bg-dark-surface/75 min-w-[190px]">
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
            <section className="mb-6 overflow-hidden rounded-[34px] border border-gold-primary/15 bg-white/72 px-4 py-4 shadow-[0_22px_80px_-48px_rgba(78,56,22,0.52)] backdrop-blur-xl dark:border-dark-border/70 dark:bg-dark-surface/72 sm:px-7 sm:py-5">
                <div className="mx-auto max-w-3xl">
                    <div className="mb-3 flex justify-center">
                        <span className="rounded-full border border-gold-primary/15 bg-gold-surface/80 px-4 py-1.5 text-[10px] font-inter uppercase tracking-[0.32em] text-gold-muted dark:border-dark-border/70 dark:bg-dark-bg/70 dark:text-gold-light/80">
                            Primary Verse
                        </span>
                    </div>

                    <div className="mb-2 text-center px-2 sm:px-0">
                        <p className="font-noto text-[24px] font-bold leading-[1.55] tracking-[0.08em] text-[#7A3030] drop-shadow-sm dark:text-[#E3A28A] sm:text-[30px] sm:leading-[1.5]">
                            {verseData.sanskrit}
                        </p>
                    </div>

                    <div className="mb-2 text-center">
                        <p className="font-noto text-[13px] italic uppercase leading-[1.55] tracking-[0.2em] text-[#9A8868] dark:text-[#D4C3A3] sm:text-[14px]">
                            {verseData.iast}
                        </p>
                    </div>

                    {verseData.korean_pronunciation && (
                        <div className="text-center">
                            <p className="mx-auto max-w-2xl font-noto-kr text-[14px] italic leading-[1.65] tracking-[0.06em] text-[#918067] dark:text-[#CBB89B]">
                                {verseData.korean_pronunciation}
                            </p>
                        </div>
                    )}
                </div>
            </section>

            <div className="mb-14 flex justify-center">
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
                <div className="flex w-full max-w-[460px] items-center justify-between rounded-full border border-gold-primary/15 bg-white/75 px-5 py-3 shadow-lg shadow-black/5 backdrop-blur-md transition-all hover:border-gold-primary/35 hover:shadow-xl dark:border-dark-border/70 dark:bg-[#101010]/78">
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

            <section className="mb-14 rounded-[30px] border border-gold-primary/12 bg-white/60 px-4 py-6 backdrop-blur-md dark:border-dark-border/60 dark:bg-dark-surface/60 sm:px-6 sm:py-7">
                <div className="mb-6 flex items-center justify-center">
                    <button
                        onClick={() => setShowLexicon(!showLexicon)}
                        className="group flex flex-col items-center gap-1.5 focus:outline-none"
                    >
                        <span className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-muted dark:text-gold-muted group-hover:text-gold-primary transition-colors font-inter">
                            Word-by-word
                        </span>
                        <div className="flex h-7 w-7 items-center justify-center rounded-full border border-gold-primary/20 bg-white/60 transition-colors group-hover:border-gold-primary/50 dark:bg-dark-bg/50">
                            {showLexicon ? (
                                <ChevronUp className="w-3.5 h-3.5 text-gold-muted group-hover:text-gold-primary transition-colors" />
                            ) : (
                                <ChevronDown className="w-3.5 h-3.5 text-gold-muted group-hover:text-gold-primary transition-colors" />
                            )}
                        </div>
                    </button>
                </div>

                <div className={`transition-all duration-500 overflow-hidden ${showLexicon ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-2.5 px-1 sm:grid-cols-2 sm:px-2 lg:grid-cols-3">
                        {verseData.words?.map((word, index) => (
                            <div key={`${word.s}-${index}`} className="group relative overflow-hidden rounded-2xl border border-gold-primary/10 bg-white/72 px-4 py-3 shadow-sm backdrop-blur-sm dark:border-dark-border/50 dark:bg-dark-bg/42">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                                <span className="mb-1 block font-crimson text-[16px] font-bold text-text-primary dark:text-dark-text-primary">{word.s}</span>
                                <span className="font-inter text-[13px] leading-relaxed text-text-secondary dark:text-dark-text-secondary break-keep">{word.m.trim()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="mb-10 rounded-[34px] border border-gold-primary/14 bg-white/70 px-4 py-7 shadow-[0_20px_80px_-52px_rgba(78,56,22,0.48)] backdrop-blur-xl dark:border-dark-border/70 dark:bg-dark-surface/72 sm:px-7 sm:py-8">
                <div className="mb-6 flex items-center justify-center">
                    <span className="text-gold-muted/40 dark:text-gold-muted/30 tracking-[8px] text-xs">•••</span>
                </div>
                <h2 className="mb-6 text-center font-inter text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-muted dark:text-gold-muted">Translation</h2>

                <div className="space-y-4">
                    {translationSections.map(section => (
                        <div key={section.id} className="rounded-2xl border border-gold-primary/10 bg-white/65 px-4 py-5 shadow-sm dark:border-dark-border/50 dark:bg-dark-bg/42 sm:px-6">
                            <h3 className="mb-3 text-center font-inter text-[11px] font-semibold uppercase tracking-[0.24em] text-gold-primary/75 dark:text-gold-light/70">
                                {section.title}
                            </h3>
                            <p className={`${section.className} mx-auto max-w-3xl whitespace-pre-line break-keep text-center text-[15px] leading-8 text-text-primary dark:text-dark-text-primary sm:text-[17px]`}>
                                {section.content}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

        </ContentReader>
    );
};

export default VerseView;
