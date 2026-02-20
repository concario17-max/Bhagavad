import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChapterList from './pages/ChapterList';
import VerseView from './pages/VerseView';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
    return (
        <Router>
            <div className="min-h-screen flex flex-col">
                <Header />
                <div className="flex flex-1">
                    <Sidebar />
                    <main className="flex-1 min-w-0">
                        <Routes>
                            <Route path="/" element={<ChapterList />} />
                            <Route path="/chapter/:chapterNum/verse/:verseNum" element={<VerseView />} />
                        </Routes>
                    </main>
                </div>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
