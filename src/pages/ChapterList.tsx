import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { withBasePath } from '../utils/paths';
import { getChapterMeta } from '../utils/chapterMeta';
import { fetchGitaData } from '../utils/dataFetcher';
import { GitaChapter } from '../types';
import { scrollAppContainerToTop } from '../utils/paths';

const CompendiumModal = lazy(() => import('../components/CompendiumModal'));
const LexiconModal = lazy(() => import('../components/LexiconModal'));

const ChapterList = () => {
    const { chapterNum } = useParams();
    const [chapters, setChapters] = useState<GitaChapter[]>([]);
    const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading');
    const [isCompendiumOpen, setIsCompendiumOpen] = useState(false);
    const [isLexiconOpen, setIsLexiconOpen] = useState(false);

    useEffect(() => {
        scrollAppContainerToTop();
    }, [chapterNum]);

    useEffect(() => {
        let cancelled = false;

        fetchGitaData()
            .then(data => {
                if (cancelled) {
                    return;
                }

                setChapters(Object.values(data));
                setLoadState('ready');
            })
            .catch(() => {
                if (!cancelled) {
                    setLoadState('error');
                }
            });

        return () => {
            cancelled = true;
        };
    }, []);

    const activeChapterNumber = useMemo(() => {
        const parsedChapter = Number.parseInt(chapterNum ?? '1', 10);
        return Number.isFinite(parsedChapter) ? parsedChapter : 1;
    }, [chapterNum]);

    const heroChapter = chapters.find(chapter => chapter.chapter === activeChapterNumber) ?? null;
    const chapterCount = chapters.length;
    const totalVerseCount = chapters.reduce((sum, chapter) => sum + chapter.verses.length, 0);

    return (
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 transition-colors duration-500 sm:px-6 lg:px-8 lg:py-8">
            <section className="overflow-hidden rounded-[36px] border border-gold-primary/14 bg-white/72 shadow-[0_26px_90px_-62px_rgba(78,56,22,0.58)] backdrop-blur-xl dark:border-dark-border/70 dark:bg-dark-surface/72">
                <div className="grid gap-8 px-5 py-7 sm:px-8 sm:py-9 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end lg:px-10 lg:py-10">
                    <div className="space-y-5">
                        <div className="flex items-center gap-3">
                            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold-primary/10 bg-gold-surface/70 shadow-sm dark:border-dark-border/70 dark:bg-dark-bg/60">
                                <img
                                    src={withBasePath('gita_header_icon.png')}
                                    alt="Bhagavad Gita icon"
                                    className="h-7 w-7 object-contain opacity-90"
                                />
                            </span>
                            <div className="space-y-1">
                                <p className="text-[11px] font-black uppercase tracking-[0.32em] text-gold-primary/80 dark:text-gold-light/80">
                                    Chapter Home
                                </p>
                                <p className="font-crimson text-sm italic text-text-secondary dark:text-dark-text-secondary">
                                    Enter by chapter, then drop straight into the verse.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h1 className="font-crimson text-4xl font-light tracking-[0.22em] text-text-primary dark:text-dark-text-primary sm:text-5xl lg:text-[56px]">
                                BHAGAVAD GITA
                            </h1>
                            <p className="max-w-2xl font-pretendard text-[15px] leading-8 text-text-secondary dark:text-dark-text-secondary sm:text-[16px]">
                                Browse the chapters as calm cards, then open any verse to continue the reading flow.
                                The layout keeps the source data intact while tightening the page into a more focused reader.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setIsCompendiumOpen(true)}
                                className="rounded-full border border-gold-primary/15 bg-white/80 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-text-secondary transition-colors hover:border-gold-primary/35 hover:text-gold-primary dark:border-dark-border/70 dark:bg-dark-bg/45 dark:text-dark-text-secondary dark:hover:text-gold-light"
                            >
                                Compendium
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsLexiconOpen(true)}
                                className="rounded-full border border-gold-primary/15 bg-white/80 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-text-secondary transition-colors hover:border-gold-primary/35 hover:text-gold-primary dark:border-dark-border/70 dark:bg-dark-bg/45 dark:text-dark-text-secondary dark:hover:text-gold-light"
                            >
                                Lexicon
                            </button>
                        </div>
                    </div>

                    <div className="grid gap-3 rounded-[30px] border border-gold-primary/12 bg-gold-surface/55 p-5 dark:border-dark-border/60 dark:bg-dark-bg/35 sm:grid-cols-3 sm:p-6 lg:grid-cols-1">
                        <div className="rounded-2xl border border-gold-primary/10 bg-white/75 px-4 py-4 dark:border-dark-border/60 dark:bg-dark-surface/70">
                            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-gold-primary/70 dark:text-gold-light/70">
                                Chapters
                            </p>
                            <p className="mt-2 font-crimson text-3xl text-text-primary dark:text-dark-text-primary">
                                {loadState === 'ready' ? chapterCount : '18'}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-gold-primary/10 bg-white/75 px-4 py-4 dark:border-dark-border/60 dark:bg-dark-surface/70">
                            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-gold-primary/70 dark:text-gold-light/70">
                                Verses
                            </p>
                            <p className="mt-2 font-crimson text-3xl text-text-primary dark:text-dark-text-primary">
                                {loadState === 'ready' ? totalVerseCount : '700+'}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-gold-primary/10 bg-white/75 px-4 py-4 dark:border-dark-border/60 dark:bg-dark-surface/70">
                            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-gold-primary/70 dark:text-gold-light/70">
                                Focus
                            </p>
                            <p className="mt-2 font-crimson text-3xl text-text-primary dark:text-dark-text-primary">
                                {heroChapter ? `Chapter ${heroChapter.chapter}` : 'Start here'}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {loadState === 'loading' && (
                <section className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div
                                key={`chapter-skeleton-${index}`}
                                className="min-h-[260px] animate-pulse rounded-[30px] border border-gold-primary/10 bg-white/60 p-6 shadow-[0_20px_60px_-48px_rgba(78,56,22,0.38)] dark:border-dark-border/60 dark:bg-dark-surface/60"
                            >
                                <div className="h-3 w-20 rounded-full bg-gold-primary/10 dark:bg-gold-light/15" />
                                <div className="mt-6 h-8 w-3/4 rounded-full bg-gold-primary/10 dark:bg-gold-light/15" />
                                <div className="mt-4 h-4 w-5/6 rounded-full bg-gold-primary/8 dark:bg-gold-light/10" />
                                <div className="mt-2 h-4 w-2/3 rounded-full bg-gold-primary/8 dark:bg-gold-light/10" />
                                <div className="mt-auto pt-10">
                                    <div className="h-10 w-full rounded-2xl bg-gold-primary/8 dark:bg-gold-light/10" />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {loadState === 'error' && (
                <section className="mx-auto w-full max-w-3xl rounded-[34px] border border-dashed border-gold-primary/20 bg-white/70 px-6 py-10 text-center shadow-[0_20px_70px_-56px_rgba(78,56,22,0.5)] dark:border-dark-border/60 dark:bg-dark-surface/70">
                    <p className="font-crimson text-3xl font-light tracking-[0.08em] text-text-primary dark:text-dark-text-primary">
                        Chapter data unavailable
                    </p>
                    <p className="mt-4 text-[15px] leading-8 text-text-secondary dark:text-dark-text-secondary">
                        The local source file could not be loaded. Refresh the page and try again.
                    </p>
                </section>
            )}

            {loadState === 'ready' && chapters.length === 0 && (
                <section className="mx-auto w-full max-w-3xl rounded-[34px] border border-dashed border-gold-primary/20 bg-white/70 px-6 py-10 text-center shadow-[0_20px_70px_-56px_rgba(78,56,22,0.5)] dark:border-dark-border/60 dark:bg-dark-surface/70">
                    <p className="font-crimson text-3xl font-light tracking-[0.08em] text-text-primary dark:text-dark-text-primary">
                        No chapters found
                    </p>
                    <p className="mt-4 text-[15px] leading-8 text-text-secondary dark:text-dark-text-secondary">
                        The dataset loaded, but it did not contain any chapter entries.
                    </p>
                </section>
            )}

            {loadState === 'ready' && chapters.length > 0 && (
                <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {chapters.map(chapter => {
                        const chapterMeta = getChapterMeta(chapter);
                        const isActive = chapter.chapter === activeChapterNumber;

                        return (
                            <Link
                                key={chapter.chapter}
                                to={`/chapter/${chapter.chapter}/verse/1`}
                                className={`group relative overflow-hidden rounded-[30px] border p-6 text-left shadow-[0_20px_60px_-50px_rgba(78,56,22,0.52)] transition-all duration-300 hover:-translate-y-1 hover:border-gold-primary/40 hover:shadow-[0_30px_80px_-55px_rgba(78,56,22,0.56)] dark:shadow-none ${
                                    isActive
                                        ? 'border-gold-primary/45 bg-gold-surface/82 dark:border-gold-light/30 dark:bg-dark-surface/85'
                                        : 'border-gold-primary/12 bg-white/72 dark:border-dark-border/70 dark:bg-dark-surface/72'
                                }`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-transparent to-transparent opacity-80 dark:from-white/[0.04] dark:via-transparent dark:to-transparent" />

                                <div className="relative z-10 flex h-full flex-col">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-gold-primary/75 dark:text-gold-light/75">
                                                Chapter {chapter.chapter}
                                            </p>
                                            {isActive && (
                                                <p className="mt-2 text-[10px] font-black uppercase tracking-[0.24em] text-text-secondary dark:text-dark-text-secondary">
                                                    Current chapter
                                                </p>
                                            )}
                                        </div>
                                        <span className="rounded-full border border-gold-primary/10 bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-text-secondary dark:border-dark-border/70 dark:bg-dark-bg/45 dark:text-dark-text-secondary">
                                            Open
                                        </span>
                                    </div>

                                    <h2 className="mt-8 font-crimson text-3xl font-light tracking-[0.06em] text-text-primary dark:text-dark-text-primary">
                                        {chapterMeta.mainTitle}
                                    </h2>
                                    {chapterMeta.subtitle && (
                                        <p className="mt-2 text-sm italic text-gold-primary/85 dark:text-gold-light/80">
                                            {chapterMeta.subtitle}
                                        </p>
                                    )}
                                    <p className="mt-4 max-w-md text-[14px] leading-7 text-text-secondary dark:text-dark-text-secondary">
                                        {chapterMeta.description}
                                    </p>

                                    <div className="mt-8 flex items-center justify-between gap-4 border-t border-gold-primary/10 pt-4 text-[11px] font-black uppercase tracking-[0.24em] text-text-secondary dark:border-dark-border/60 dark:text-dark-text-secondary">
                                        <span>{chapter.verses.length} verses</span>
                                        <span>Start at verse 1</span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </section>
            )}

            <Suspense fallback={null}>
                {isCompendiumOpen && <CompendiumModal isOpen={isCompendiumOpen} onClose={() => setIsCompendiumOpen(false)} />}
                {isLexiconOpen && <LexiconModal isOpen={isLexiconOpen} onClose={() => setIsLexiconOpen(false)} />}
            </Suspense>
        </div>
    );
};

export default ChapterList;
