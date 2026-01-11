import { createContext, useContext, useState, useRef, useCallback } from 'react';

const AudioContext = createContext(null);

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error('useAudio must be used within an AudioProvider');
    }
    return context;
};

export const AudioProvider = ({ children }) => {
    const [currentTrack, setCurrentTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const audioRef = useRef(null);
    const progressIntervalRef = useRef(null);

    const stopProgressTracking = useCallback(() => {
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
        }
    }, []);

    const startProgressTracking = useCallback(() => {
        stopProgressTracking();
        const startTime = Date.now();
        const duration = 30000; // 30 seconds

        progressIntervalRef.current = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const newProgress = Math.min((elapsed / duration) * 100, 100);
            setProgress(newProgress);

            if (newProgress >= 100) {
                stopProgressTracking();
            }
        }, 100);
    }, [stopProgressTracking]);

    const play = useCallback((track) => {
        // Stop current audio if any
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        stopProgressTracking();

        if (!track?.preview_url) return;

        // Create and play new audio
        const audio = new Audio(track.preview_url);
        audioRef.current = audio;

        audio.onended = () => {
            setIsPlaying(false);
            setProgress(100);
            stopProgressTracking();
            // Hide player after preview ends
            setTimeout(() => {
                setIsVisible(false);
                setCurrentTrack(null);
                setProgress(0);
            }, 2000);
        };

        audio.onerror = () => {
            setIsPlaying(false);
            setIsVisible(false);
            setCurrentTrack(null);
            stopProgressTracking();
        };

        audio.play();
        setCurrentTrack(track);
        setIsPlaying(true);
        setIsVisible(true);
        setIsMinimized(false);
        setProgress(0);
        startProgressTracking();
    }, [startProgressTracking, stopProgressTracking]);

    const pause = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
        setIsPlaying(false);
        stopProgressTracking();
    }, [stopProgressTracking]);

    const resume = useCallback(() => {
        if (audioRef.current && currentTrack) {
            audioRef.current.play();
            setIsPlaying(true);
            startProgressTracking();
        }
    }, [currentTrack, startProgressTracking]);

    const togglePlayPause = useCallback(() => {
        if (isPlaying) {
            pause();
        } else {
            resume();
        }
    }, [isPlaying, pause, resume]);

    const stop = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        stopProgressTracking();
        setIsPlaying(false);
        setIsVisible(false);
        setCurrentTrack(null);
        setProgress(0);
        setIsMinimized(false);
    }, [stopProgressTracking]);

    const minimize = useCallback(() => {
        setIsMinimized(true);
    }, []);

    const expand = useCallback(() => {
        setIsMinimized(false);
    }, []);

    const value = {
        currentTrack,
        isPlaying,
        progress,
        isMinimized,
        isVisible,
        play,
        pause,
        resume,
        togglePlayPause,
        stop,
        minimize,
        expand,
    };

    return (
        <AudioContext.Provider value={value}>
            {children}
        </AudioContext.Provider>
    );
};
