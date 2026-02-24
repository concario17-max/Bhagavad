import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Outlet } from 'react-router-dom';
import ChapterList from './pages/ChapterList';
import VerseView from './pages/VerseView';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Footer from './components/Footer';
import Reflections from './components/Reflections';
import PasswordGateway from './components/PasswordGateway';

const MainLayout = () => {
    const location = useLocation();
    const isVerseView = location.pathname.includes('/chapter/') && location.pathname.includes('/verse/');

    return (
        <div className="min-h-screen flex flex-col bg-gold-bg dark:bg-dark-bg transition-colors duration-500">
            <Header />
            <div className="flex flex-1 relative">
                {isVerseView && <Sidebar />}
                <main className="flex-1 min-w-0">
                    <Outlet />
                </main>
                {isVerseView && <Reflections />}
            </div>
            {!isVerseView && <Footer />}
        </div>
    );
};

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const authStat = localStorage.getItem('gita_authenticated') === 'true';
        setIsAuthenticated(authStat);
        setIsChecking(false);
    }, []);

    const handleAuthenticate = () => {
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
