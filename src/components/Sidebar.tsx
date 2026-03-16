import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUI } from '../context/UIContext';
import { fetchGitaData } from '../utils/dataFetcher';
import { getChapterMeta } from '../utils/chapterMeta';
import { GitaChapter } from '../types';
import { SidebarLayout } from './ui/SidebarLayout';
import { SidebarMenu, NavGroupType, NavItemType } from './ui/SidebarMenu';

const Sidebar = () => {
    const { chapterNum, verseNum } = useParams<{ chapterNum: string; verseNum: string }>();
    const { isSidebarOpen, setIsSidebarOpen, isDesktopSidebarOpen } = useUI();
    const [chapters, setChapters] = useState<GitaChapter[]>([]);
    const [expandedChapter, setExpandedChapter] = useState<number | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchGitaData()
            .then(data => {
                setChapters(Object.values(data));
            })
            .catch(err => console.error('Failed to load chapters:', err));
    }, []);

    useEffect(() => {
        if (chapterNum) {
            setExpandedChapter(Number.parseInt(chapterNum, 10));
        }
    }, [chapterNum]);

    const toggleChapter = (chapterNumber: number): void => {
        setExpandedChapter(chapterNumber);
        navigate(`/chapter/${chapterNumber}/verse/1`);
    };

    const currentChapter = chapters.find(chapter => chapter.chapter === expandedChapter);

    const groups: NavGroupType[] = chapters.map(chapter => {
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

    return (
        <SidebarLayout
            isOpen={isSidebarOpen}
            isDesktopOpen={isDesktopSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            title="Chapters"
            position="left"
            widthClass="w-80"
        >
            <SidebarMenu
                groups={groups}
                onItemClick={() => setIsSidebarOpen(false)}
                groupTitle="Chapters"
            />
        </SidebarLayout>
    );
};

export default Sidebar;
