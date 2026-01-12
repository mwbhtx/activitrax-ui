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
    const [queue, setQueue] = useState([]);
    const [queueIndex, setQueueIndex] = useState(-1);
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

    const playTrackInternal = useCallback((track, onEnded) => {
        // Stop current audio if any
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        stopProgressTracking();

        if (!track?.preview_url) {
            onEnded?.();
            return;
        }

        // Create and play new audio
        const audio = new Audio(track.preview_url);
        audioRef.current = audio;

        audio.onended = () => {
            setIsPlaying(false);
            setProgress(100);
            stopProgressTracking();
            onEnded?.();
        };

        audio.onerror = () => {
            setIsPlaying(false);
            stopProgressTracking();
            onEnded?.();
        };

        audio.play();
        setCurrentTrack(track);
        setIsPlaying(true);
        setIsVisible(true);
        setIsMinimized(false);
        setProgress(0);
        startProgressTracking();
    }, [startProgressTracking, stopProgressTracking]);

    const playNextInQueue = useCallback(() => {
        setQueueIndex(prevIndex => {
            const nextIndex = prevIndex + 1;
            setQueue(currentQueue => {
                if (nextIndex < currentQueue.length) {
                    const nextTrack = currentQueue[nextIndex];
                    // Find next track with preview_url
                    let trackToPlay = nextTrack;
                    let searchIndex = nextIndex;
                    while (!trackToPlay?.preview_url && searchIndex < currentQueue.length - 1) {
                        searchIndex++;
                        trackToPlay = currentQueue[searchIndex];
                    }
                    if (trackToPlay?.preview_url) {
                        playTrackInternal(trackToPlay, () => playNextInQueue());
                        return currentQueue;
                    }
                }
                // Queue finished
                setTimeout(() => {
                    setIsVisible(false);
                    setCurrentTrack(null);
                    setProgress(0);
                    setQueue([]);
                    setQueueIndex(-1);
                }, 2000);
                return currentQueue;
            });
            return nextIndex;
        });
    }, [playTrackInternal]);

    const play = useCallback((track) => {
        // Clear queue when playing single track
        setQueue([]);
        setQueueIndex(-1);
        playTrackInternal(track, () => {
            // Hide player after preview ends
            setTimeout(() => {
                setIsVisible(false);
                setCurrentTrack(null);
                setProgress(0);
            }, 2000);
        });
    }, [playTrackInternal]);

    const playAll = useCallback((tracks) => {
        if (!tracks || tracks.length === 0) return;
        // Filter to only tracks with preview URLs
        const playableTracks = tracks.filter(t => t.preview_url);
        if (playableTracks.length === 0) return;

        setQueue(playableTracks);
        setQueueIndex(0);
        playTrackInternal(playableTracks[0], () => playNextInQueue());
    }, [playTrackInternal, playNextInQueue]);

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
        queue,
        queueIndex,
        play,
        playAll,
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
