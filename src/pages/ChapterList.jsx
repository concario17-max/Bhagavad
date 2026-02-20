import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CHAPTER_DATA } from '../constants';

const ChapterList = () => {
    const [chapters, setChapters] = useState([]);

    useEffect(() => {
        fetch('/gita.json')
            .then(res => res.json())
            .then(data => {
                if (data && typeof data === 'object') {
                    const chapterArray = Object.values(data);
                    setChapters(chapterArray);
                } else {
                    console.error('Invalid gita.json format');
                }
            })
            .catch(err => console.error('Failed to load chapters:', err));
    }, []);

    return (
        <div className="container mx-auto max-w-5xl px-4 py-12">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold font-crimson text-prakash-primary dark:text-nisha-primary mb-4">
                    Bhagavad Gita
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-inter">
                    Experience the timeless wisdom of the Gita with a modern, distraction-free reading interface.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {chapters.map((ch) => {
                    const chapterInfo = CHAPTER_DATA[ch.chapter];
                    return (
                        <Link
                            key={ch.chapter}
                            to={`/chapter/${ch.chapter}/verse/1`}
                            className="group relative overflow-hidden p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-prakash-primary dark:hover:border-nisha-primary shadow-sm hover:shadow-md transition-all duration-300"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <span className="text-6xl font-crimson font-bold text-gray-900 dark:text-white">
                                    {ch.chapter}
                                </span>
                            </div>

                            <div className="relative z-10">
                                <span className="inline-block px-2 py-1 mb-3 text-xs font-semibold tracking-wider uppercase bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
                                    Chapter {ch.chapter}
                                </span>
                                <h2 className="text-xl font-bold mb-2 group-hover:text-prakash-primary dark:group-hover:text-nisha-primary transition-colors font-crimson">
                                    {chapterInfo?.name || ch.name_translated}
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-inter mb-4 line-clamp-3">
                                    {chapterInfo?.description}
                                </p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 font-inter flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-prakash-primary dark:bg-nisha-primary"></span>
                                    {ch.verses.length} Verses
                                </p>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default ChapterList;
