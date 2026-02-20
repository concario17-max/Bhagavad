import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChapterList from './pages/ChapterList';
import VerseView from './pages/VerseView';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
    return (
        <Router>
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<ChapterList />} />
                        <Route path="/chapter/:chapterNum/verse/:verseNum" element={<VerseView />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
