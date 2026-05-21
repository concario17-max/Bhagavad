import { BookOpenText } from 'lucide-react';
import { GitaVerse } from '../../types';
import { TranslationDefinition } from '../../utils/content';
import VerseAudioPlayer from './VerseAudioPlayer';
import VerseNavigationFooter from './VerseNavigationFooter';
import VersePrimaryCard from './VersePrimaryCard';
import VerseTranslationsSection from './VerseTranslationsSection';

interface VerseDeepDivePanelProps {
    audioSrc?: string;
    canGoNext: boolean;
    canGoPrevious: boolean;
    onNext: () => void;
    onPrevious: () => void;
    translationSections: TranslationDefinition[];
    verse: GitaVerse;
    verseLabel: string;
}

const VerseDeepDivePanel = ({
    audioSrc,
    canGoNext,
    canGoPrevious,
    onNext,
    onPrevious,
    translationSections,
    verse,
    verseLabel
}: VerseDeepDivePanelProps) => {
    return (
        <section className="rounded-[34px] border border-gold-primary/15 bg-white/72 p-4 shadow-[0_22px_80px_-48px_rgba(78,56,22,0.52)] backdrop-blur-xl dark:border-dark-border/70 dark:bg-dark-surface/72 sm:p-6">
            <div className="mb-5 border-b border-gold-border/30 pb-3">
                <div className="flex items-center gap-2">
                    <BookOpenText className="h-5 w-5 text-[#A68B5C] dark:text-gold-light" />
                    <h2 className="text-sm font-bold tracking-wide text-[#1C2B36] dark:text-dark-text-primary">Deep Dive</h2>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-text-secondary dark:text-dark-text-secondary">
                    본문, 발음, 오디오, 이동 버튼을 모아 둔 심화 보기입니다.
                </p>
            </div>

            <div className="space-y-0">
                <VersePrimaryCard verse={verse} />
                <VerseTranslationsSection sections={translationSections} title="Deep Dive Translation" />
                <VerseAudioPlayer audioSrc={audioSrc} />
                <VerseNavigationFooter
                    canGoPrevious={canGoPrevious}
                    canGoNext={canGoNext}
                    onPrevious={onPrevious}
                    onNext={onNext}
                    verseLabel={verseLabel}
                />
            </div>
        </section>
    );
};

export default VerseDeepDivePanel;
