import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CHAPTER_DATA } from '../constants';
import { useUI } from '../context/UIContext';
import { fetchGitaData } from '../utils/dataFetcher';
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
                if (data && typeof data === 'object') {
                    const chapterArray = Object.values(data) as GitaChapter[];
                    setChapters(chapterArray);
                }
            })
            .catch(err => console.error('Failed to load chapters:', err));
    }, []);

    useEffect(() => {
        if (chapterNum) {
            setExpandedChapter(parseInt(chapterNum));
        }
    }, [chapterNum]);

    const toggleChapter = (chNum: number) => {
        setExpandedChapter(chNum);
        navigate(`/chapter/${chNum}/verse/1`);
    };

    const currentChapter = chapters.find(ch => ch.chapter === expandedChapter);

    // 라우팅 데이터를 범용 NavGroups 포맷으로 변환 (Zero Monolith Logic Extraction)
    const groups: NavGroupType[] = chapters.map(ch => {
        const titleRaw = CHAPTER_DATA[ch.chapter]?.name_korean || ch.name_translated || "";
        const hasSub = titleRaw.includes('(');
        const mainTitle = hasSub ? titleRaw.substring(0, titleRaw.indexOf('(')).trim() : titleRaw;
        const subTitle = hasSub ? titleRaw.substring(titleRaw.indexOf('(')).trim() : undefined;

        const isExpanded = expandedChapter === ch.chapter;

        // items are dynamically built if the chapter is expanded, to save processing, 
        // or we build everything. Building what is current chapter is fine.
        let items: NavItemType[] = [];
        if (isExpanded && currentChapter) {
            items = currentChapter.verses.map((v, idx) => {
                const nextV = currentChapter.verses[idx + 1];
                let displayVerse = `${currentChapter.chapter}.${v.verse}`;

                if (nextV && nextV.verse > v.verse + 1) {
                    displayVerse = `${currentChapter.chapter}.${v.verse}-${nextV.verse - 1}`;
                }

                const verseText = v.iast ? v.iast.split('\n')[0].substring(0, 40) + '...' : `Verse ${v.verse}`;
                const isActive = v.chapter === parseInt(chapterNum || '1') && v.verse === parseInt(verseNum || '1');

                return {
                    id: String(v.verse),
                    label: displayVerse,
                    href: `/chapter/${currentChapter.chapter}/verse/${v.verse}`,
                    description: verseText,
                    isActive
                };
            });
        }

        return {
            id: ch.chapter,
            title: `${ch.chapter}. ${mainTitle}`,
            subtitle: subTitle,
            badge: ch.verses.length,
            isExpanded,
            onToggle: () => toggleChapter(ch.chapter),
            items
        };
    });

    return (
        <SidebarLayout
            isOpen={isSidebarOpen}
            isDesktopOpen={isDesktopSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            title="장 (Chapter)"
            position="left"
            widthClass="w-80"
        >
            <SidebarMenu
                groups={groups}
                onItemClick={() => setIsSidebarOpen(false)}
                groupTitle="장 (Chapter)"
            />
        </SidebarLayout>
    );
};

export default Sidebar;
