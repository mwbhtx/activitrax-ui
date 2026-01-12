import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { getLikedTrackIds } from '../services/likedTracks';

const LikedTracksContext = createContext(null);

export const useLikedTracks = () => {
    const context = useContext(LikedTracksContext);
    if (!context) {
        throw new Error('useLikedTracks must be used within a LikedTracksProvider');
    }
    return context;
};

export const LikedTracksProvider = ({ children }) => {
    const { getAccessTokenSilently, isAuthenticated } = useAuth0();
    const [likedTrackIds, setLikedTrackIds] = useState(new Set());
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const fetchLikedTrackIds = async () => {
            try {
                const api_token = await getAccessTokenSilently();
                const ids = await getLikedTrackIds(api_token);
                setLikedTrackIds(new Set(ids));
            } catch (error) {
                console.log('Failed to fetch liked tracks:', error);
            } finally {
                setIsLoaded(true);
            }
        };

        if (isAuthenticated) {
            fetchLikedTrackIds();
        }
    }, [getAccessTokenSilently, isAuthenticated]);

    const isLiked = useCallback((spotifyTrackId) => {
        return likedTrackIds.has(spotifyTrackId);
    }, [likedTrackIds]);

    const handleLikeChange = useCallback((spotifyTrackId, liked) => {
        setLikedTrackIds(prev => {
            const newSet = new Set(prev);
            if (liked) {
                newSet.add(spotifyTrackId);
            } else {
                newSet.delete(spotifyTrackId);
            }
            return newSet;
        });
    }, []);

    const value = {
        likedTrackIds,
        isLiked,
        handleLikeChange,
        isLoaded,
    };

    return (
        <LikedTracksContext.Provider value={value}>
            {children}
        </LikedTracksContext.Provider>
    );
};
