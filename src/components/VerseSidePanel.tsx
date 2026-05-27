import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import VerseCommentary from './VerseCommentary';
import VerseDeepDivePanel from './verse/VerseDeepDivePanel';
import { useUI } from '../context/UIContext';
import { useVerseData } from '../context/VerseDataContext';
import { SidebarLayout } from './ui/SidebarLayout';
import { getNextVersePath, getPreviousVersePath } from '../utils/verse';
import { getDeepDiveTranslationDefinitions } from '../utils/content';
import { withBasePath } from '../utils/paths';

const panelVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0 }
};

const VerseSidePanel = () => {
    const navigate = useNavigate();
    const {
        allChapters,
        chapterNum,
        currentChapter,
        currentChapterNumber,
        verseData,
        verseRange
    } = useVerseData();
    const {
        isCommentaryPanelOpen,
        setIsCommentaryPanelOpen,
        isDesktopCommentaryPanelOpen,
        rightPanelMode
    } = useUI();

    const isCommentaryMode = rightPanelMode === 'commentary';

    if (!allChapters || !currentChapter || !verseData) {
        return null;
    }

    const previousVersePath = getPreviousVersePath(allChapters, chapterNum, verseData);
    const nextVersePath = getNextVersePath(allChapters, chapterNum, verseData);
    const audioFilename = verseData.audio?.split('/').pop();
    const audioSrc = audioFilename ? withBasePath(`mp3/${audioFilename}`) : undefined;
    const deepDiveTranslationSections = getDeepDiveTranslationDefinitions(verseData);

    return (
        <SidebarLayout
            isOpen={isCommentaryPanelOpen}
            isDesktopOpen={isDesktopCommentaryPanelOpen}
            onClose={() => setIsCommentaryPanelOpen(false)}
            position="right"
            widthClass="w-[94vw]"
            desktopWidthClass="lg:col-start-3 lg:w-full"
        >
            <div className="relative flex h-full min-h-0 flex-col p-4 sm:p-5 lg:p-6">
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={isCommentaryMode ? 'commentary' : 'deep-dive'}
                        variants={panelVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        transition={{ duration: 0.22, ease: 'easeOut' }}
                        className="min-h-0"
                    >
                        {isCommentaryMode ? (
                            <VerseCommentary />
                        ) : (
                            <VerseDeepDivePanel
                                audioSrc={audioSrc}
                                canGoNext={nextVersePath !== null}
                                canGoPrevious={previousVersePath !== null}
                                onNext={() => {
                                    if (nextVersePath) {
                                        navigate(nextVersePath);
                                    }
                                }}
                                onPrevious={() => {
                                    if (previousVersePath) {
                                        navigate(previousVersePath);
                                    }
                                }}
                                translationSections={deepDiveTranslationSections}
                                verse={verseData}
                                verseLabel={`${currentChapterNumber}.${verseRange}`}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </SidebarLayout>
    );
};

export default VerseSidePanel;
