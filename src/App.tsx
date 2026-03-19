import { useEffect, Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Outlet } from 'react-router-dom';

const ChapterList = lazy(() => import('./pages/ChapterList'));
const VerseView = lazy(() => import('./pages/VerseView'));
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ThemeToggle from './components/ThemeToggle';
import VersePanelToggle from './components/VersePanelToggle';
import VerseSidePanel from './components/VerseSidePanel';
import { useUI } from './context/UIContext';
import { preloadGitaData } from './utils/dataFetcher';

import { AppShell } from './components/ui/AppShell';

const MainLayout = () => {
    const location = useLocation();
    const isVerseView = location.pathname.includes('/chapter/') && location.pathname.includes('/verse/');
    const { isSidebarOpen, isCommentaryPanelOpen } = useUI();

    return (
        <AppShell
            header={isVerseView ? <Header rightContent={<VersePanelToggle />} /> : undefined}
            sidebar={isVerseView ? <Sidebar /> : undefined}
            rightPanel={isVerseView ? <VerseSidePanel /> : undefined}
            isMobilePanelOpen={isSidebarOpen || isCommentaryPanelOpen}
            floatingAction={
                !isVerseView ? (
                    <ThemeToggle className="p-3 bg-white/80 dark:bg-[#111]/80 backdrop-blur-md border border-gold-primary/20 dark:border-gold-primary/10 hover:border-gold-primary/40 shadow-xl shadow-black/5 dark:shadow-[0_8px_30px_-5px_rgba(0,0,0,0.6)] hover:-translate-y-1" />
                ) : undefined
            }
        >
            <Suspense fallback={<div className="h-full flex items-center justify-center bg-transparent"><div className="w-8 h-8 border-4 border-gold-primary border-t-transparent rounded-full animate-spin"></div></div>}>
                <Outlet />
            </Suspense>
        </AppShell>
    );
};

function App() {
    useEffect(() => {
        preloadGitaData();
    }, []);

    return (
        <Router>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<ChapterList />} />
                    <Route path="/chapter/:chapterNum/verse/:verseNum" element={<VerseView />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
