import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';

interface VerseAudioPlayerProps {
    audioSrc?: string;
}

const formatTime = (time: number): string => {
    if (Number.isNaN(time)) {
        return '0:00';
    }

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const VerseAudioPlayer = ({ audioSrc }: VerseAudioPlayerProps) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);

        if (!audioRef.current) {
            return;
        }

        audioRef.current.pause();
        audioRef.current.currentTime = 0;
    }, [audioSrc]);

    const togglePlay = (): void => {
        const audioElement = audioRef.current;
        if (!audioElement || !audioSrc) {
            return;
        }

        if (isPlaying) {
            audioElement.pause();
        } else {
            void audioElement.play();
        }

        setIsPlaying(previous => !previous);
    };

    const progressPercent = duration ? (currentTime / duration) * 100 : 0;

    return (
        <div className="mb-14 flex justify-center">
            <audio
                ref={audioRef}
                src={audioSrc}
                onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime ?? 0)}
                onLoadedMetadata={() => setDuration(audioRef.current?.duration ?? 0)}
                onEnded={() => {
                    setIsPlaying(false);
                    setCurrentTime(0);
                }}
                className="hidden"
            />
            <div className="flex w-full max-w-[460px] items-center justify-between rounded-full border border-gold-primary/15 bg-white/75 px-5 py-3 shadow-lg shadow-black/5 backdrop-blur-md transition-all hover:border-gold-primary/35 hover:shadow-xl dark:border-dark-border/70 dark:bg-[#101010]/78">
                <button
                    onClick={togglePlay}
                    disabled={!audioSrc}
                    className={`text-gold-primary dark:text-gold-light hover:scale-110 transition-transform ${!audioSrc ? 'opacity-30 cursor-not-allowed hidden' : ''}`}
                >
                    {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>

                <span className="text-[10px] text-text-secondary/50 font-inter font-bold tracking-widest tabular-nums ml-4">
                    {formatTime(currentTime)}
                </span>

                <div
                    className="relative flex-1 mx-4 h-[2px] bg-gold-border/30 dark:bg-dark-border rounded-full cursor-pointer group"
                    onClick={event => {
                        if (!audioRef.current || duration === 0) {
                            return;
                        }

                        const rect = event.currentTarget.getBoundingClientRect();
                        const offset = event.clientX - rect.left;
                        const percentage = offset / rect.width;
                        audioRef.current.currentTime = percentage * duration;
                    }}
                >
                    <div className="absolute top-0 left-0 h-full bg-[#A68B5C] transition-all" style={{ width: `${progressPercent}%` }}></div>
                    <div
                        className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-[#A68B5C] rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ left: `calc(${progressPercent}% - 4px)` }}
                    ></div>
                </div>

                <span className="text-[10px] text-text-secondary/50 font-inter font-bold tracking-widest tabular-nums">
                    {formatTime(duration)}
                </span>
            </div>
        </div>
    );
};

export default VerseAudioPlayer;
