import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUI } from '../context/UIContext';
import { useVerseData } from '../context/VerseDataContext';
import { getChapterMeta } from '../utils/chapterMeta';
import { GitaChapter } from '../types';
import { SidebarLayout } from './ui/SidebarLayout';
import { SidebarMenu, NavGroupType, NavItemType } from './ui/SidebarMenu';

const Sidebar = () => {
    const { chapterNum, verseNum } = useParams<{ chapterNum: string; verseNum: string }>();
    const { isSidebarOpen, setIsSidebarOpen, isDesktopSidebarOpen } = useUI();
    const { allChapters, status } = useVerseData();
    const [expandedChapter, setExpandedChapter] = useState<number | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (chapterNum) {
            setExpandedChapter(Number.parseInt(chapterNum, 10));
        }
    }, [chapterNum]);

    const chapters = useMemo<GitaChapter[]>(() => allChapters ? Object.values(allChapters) : [], [allChapters]);

    const toggleChapter = (chapterNumber: number): void => {
        setExpandedChapter(chapterNumber);
        navigate(`/chapter/${chapterNumber}/verse/1`);
    };

    const currentChapter = chapters.find(chapter => chapter.chapter === expandedChapter);

    const groups = useMemo<NavGroupType[]>(() => {
        return chapters.map(chapter => {
            const chapterMeta = getChapterMeta(chapter);
            const isExpanded = expandedChapter === chapter.chapter;

            const items: NavItemType[] = isExpanded && currentChapter
                ? currentChapter.verses.map((verse, index) => {
                    const nextVerse = currentChapter.verses[index + 1];
                    const displayVerse = nextVerse && nextVerse.verse > verse.verse + 1
                        ? `${currentChapter.chapter}.${verse.verse}-${nextVerse.verse - 1}`
                        : `${currentChapter.chapter}.${verse.verse}`;

                    return {
                        id: String(verse.verse),
                        label: displayVerse,
                        href: `/chapter/${currentChapter.chapter}/verse/${verse.verse}`,
                        description: verse.iast ? `${verse.iast.split('\n')[0].slice(0, 40)}...` : `Verse ${verse.verse}`,
                        isActive: verse.chapter === Number.parseInt(chapterNum || '1', 10) && verse.verse === Number.parseInt(verseNum || '1', 10)
                    };
                })
                : [];

            return {
                id: chapter.chapter,
                title: `${chapter.chapter}. ${chapterMeta.mainTitle}`,
                subtitle: chapterMeta.subtitle,
                badge: chapter.verses.length,
                isExpanded,
                onToggle: () => toggleChapter(chapter.chapter),
                items
            };
        });
    }, [chapterNum, chapters, currentChapter, expandedChapter, verseNum]);

    return (
        <SidebarLayout
            isOpen={isSidebarOpen}
            isDesktopOpen={isDesktopSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            title="Chapters"
            position="left"
            widthClass="w-[400px]"
            desktopWidthClass="lg:col-start-1 lg:w-full"
        >
            {status === 'error' ? (
                <div className="flex h-full items-center justify-center px-6 text-center">
                    <p className="font-pretendard text-sm leading-7 text-text-secondary dark:text-dark-text-secondary">
                        Chapter navigation is temporarily unavailable because the source data could not be loaded.
                    </p>
                </div>
            ) : (
                <SidebarMenu
                    groups={groups}
                    onItemClick={() => setIsSidebarOpen(false)}
                    groupTitle="Chapters"
                />
            )}
        </SidebarLayout>
    );
};

export default Sidebar;
