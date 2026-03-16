import { useState, useEffect, Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Outlet } from 'react-router-dom';

const ChapterList = lazy(() => import('./pages/ChapterList'));
const VerseView = lazy(() => import('./pages/VerseView'));
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Reflections from './components/Reflections';
import PasswordGateway from './components/PasswordGateway';
import ThemeToggle from './components/ThemeToggle';
import { useUI } from './context/UIContext';

import { AppShell } from './components/ui/AppShell';

const MainLayout = () => {
    const location = useLocation();
    const isVerseView = location.pathname.includes('/chapter/') && location.pathname.includes('/verse/');
    const { isSidebarOpen } = useUI();

    return (
        <AppShell
            header={isVerseView ? <Header /> : undefined}
            sidebar={isVerseView ? <Sidebar /> : undefined}
            rightPanel={isVerseView ? <Reflections /> : undefined}
            isMobilePanelOpen={isSidebarOpen}
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
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isChecking, setIsChecking] = useState<boolean>(true);

    useEffect(() => {
        // 인증 상태 로컬 스토리지 로드.
        const authStat = localStorage.getItem('gita_authenticated') === 'true';
        setIsAuthenticated(authStat);
        setIsChecking(false);
    }, []);

    const handleAuthenticate = () => {
        // 인증 상태 로컬 스토리지 저장 및 업데이트.
        localStorage.setItem('gita_authenticated', 'true');
        setIsAuthenticated(true);
    };

    if (isChecking) {
        return <div className="min-h-screen bg-gold-bg dark:bg-dark-bg"></div>;
    }

    if (!isAuthenticated) {
        return <PasswordGateway onAuthenticate={handleAuthenticate} />;
    }

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
