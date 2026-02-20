import { BrowserRouter as Router, Routes, Route, useLocation, Outlet } from 'react-router-dom';
import ChapterList from './pages/ChapterList';
import VerseView from './pages/VerseView';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Footer from './components/Footer';
import Reflections from './components/Reflections';

const MainLayout = () => {
    const location = useLocation();
    const isVerseView = location.pathname.includes('/chapter/') && location.pathname.includes('/verse/');

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex flex-1 relative">
                {isVerseView && <Sidebar />}
                <main className={`flex-1 min-w-0 ${isVerseView ? 'bg-prakash-bg dark:bg-nisha-bg' : ''}`}>
                    <Outlet />
                </main>
                {isVerseView && <Reflections />}
            </div>
            {!isVerseView && <Footer />}
        </div>
    );
};

function App() {
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
