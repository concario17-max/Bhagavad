import { useEffect, Suspense, lazy } from 'react';
import { HashRouter as Router, Navigate, Outlet, Route, Routes, matchPath, useLocation } from 'react-router-dom';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import { AppShell } from './components/ui/AppShell';
import { getDesktopVerseColumns } from './components/ui/desktopVerseLayout';
import { useUI } from './context/UIContext';
import { VerseDataProvider } from './context/VerseDataContext';
import { preloadGitaData } from './utils/dataFetcher';

const ChapterList = lazy(() => import('./pages/ChapterList'));
const VerseView = lazy(() => import('./pages/VerseView'));

const MainLayout = () => {
    const location = useLocation();
    const verseMatch = matchPath('/chapter/:chapterNum/verse/:verseNum', location.pathname);
    const { isSidebarOpen, isDesktopSidebarOpen } = useUI();

    const isVerseRoute = Boolean(verseMatch?.params.chapterNum && verseMatch.params.verseNum);
    const desktopGridColumns = isVerseRoute
        ? getDesktopVerseColumns(isDesktopSidebarOpen, false)
        : undefined;
    const isMobilePanelOpen = isVerseRoute && isSidebarOpen;

    const shell = (
        <AppShell
            header={<Header />}
            sidebar={isVerseRoute ? <Sidebar /> : undefined}
            desktopGridColumns={desktopGridColumns}
            isMobilePanelOpen={isMobilePanelOpen}
        >
            <Suspense
                fallback={(
                    <div className="flex h-full items-center justify-center bg-transparent">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold-primary border-t-transparent" />
                    </div>
                )}
            >
                <Outlet />
            </Suspense>
        </AppShell>
    );

    if (isVerseRoute && verseMatch?.params.chapterNum && verseMatch.params.verseNum) {
        return (
            <VerseDataProvider chapterNum={verseMatch.params.chapterNum} verseNum={verseMatch.params.verseNum}>
                {shell}
            </VerseDataProvider>
        );
    }

    return shell;
};

function App() {
    useEffect(() => {
        preloadGitaData();
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/chapter/1" replace />} />
                <Route element={<MainLayout />}>
                    <Route path="/chapter/:chapterNum" element={<ChapterList />} />
                    <Route path="/chapter/:chapterNum/verse/:verseNum" element={<VerseView />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
