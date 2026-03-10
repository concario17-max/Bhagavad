import { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Outlet } from 'react-router-dom';

const ChapterList = lazy(() => import('./pages/ChapterList'));
const VerseView = lazy(() => import('./pages/VerseView'));
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Footer from './components/Footer';
import Reflections from './components/Reflections';
import PasswordGateway from './components/PasswordGateway';
import { useUI } from './context/UIContext';

const MainLayout = () => {
    const location = useLocation();
    const isVerseView = location.pathname.includes('/chapter/') && location.pathname.includes('/verse/');
    const { isSidebarOpen } = useUI();

    return (
        <div className="h-[100dvh] flex flex-col bg-gold-bg dark:bg-dark-bg transition-colors duration-500 relative selection:bg-gold-primary/20 selection:text-text-primary dark:selection:text-dark-text-primary overflow-hidden">
            {/* Ambient luxury spotlight overlay. */}
            <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.65)_0%,_transparent_80%)] dark:bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.04)_0%,_transparent_80%)] z-0"></div>

            <div className="relative z-10 flex flex-col flex-1 h-full overflow-hidden">
                <Header />
                <div className="flex flex-1 relative overflow-hidden">
                    {isVerseView && <Sidebar />}
                    <main className={`flex-1 min-w-0 custom-scrollbar ${isSidebarOpen ? 'overflow-hidden touch-none' : 'overflow-y-auto'}`}>
                        <Suspense fallback={<div className="h-full flex items-center justify-center bg-transparent"><div className="w-8 h-8 border-4 border-gold-primary border-t-transparent rounded-full animate-spin"></div></div>}>
                            <Outlet />
                        </Suspense>
                    </main>
                    {isVerseView && <Reflections />}
                </div>
                {!isVerseView && <Footer />}
            </div>
        </div>
    );
};

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

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
