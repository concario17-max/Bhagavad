import { useEffect, Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route, matchPath, useLocation, Outlet } from 'react-router-dom';

const ChapterList = lazy(() => import('./pages/ChapterList'));
const VerseView = lazy(() => import('./pages/VerseView'));
import Header from './components/Header';
import { AppShell } from './components/ui/AppShell';
import { VerseDataProvider } from './context/VerseDataContext';
import { preloadGitaData } from './utils/dataFetcher';

const MainLayout = () => {
    const location = useLocation();
    const verseMatch = matchPath('/chapter/:chapterNum/verse/:verseNum', location.pathname);

    const shell = (
        <AppShell header={<Header />}>
            <Suspense fallback={<div className="h-full flex items-center justify-center bg-transparent"><div className="w-8 h-8 border-4 border-gold-primary border-t-transparent rounded-full animate-spin"></div></div>}>
                <Outlet />
            </Suspense>
        </AppShell>
    );

    if (verseMatch?.params.chapterNum && verseMatch.params.verseNum) {
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
                <Route element={<MainLayout />}>
                    <Route path="/" element={<ChapterList />} />
                    <Route path="/chapter/:chapterNum/verse/:verseNum" element={<VerseView />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
