import React, { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useAuth0 } from '@auth0/auth0-react';
import { likeTrack, unlikeTrack, getSpotifyTrackId } from '../services/likedTracks';

const LikeButton = ({ track, isLiked, onLikeChange }) => {
    const { getAccessTokenSilently } = useAuth0();
    const [liked, setLiked] = useState(isLiked);
    const [loading, setLoading] = useState(false);

    const spotifyTrackId = getSpotifyTrackId(track);

    // Sync with prop changes
    React.useEffect(() => {
        setLiked(isLiked);
    }, [isLiked]);

    const handleClick = async (event) => {
        event.stopPropagation();

        if (!spotifyTrackId || loading) return;

        // Optimistic update
        const newLikedState = !liked;
        setLiked(newLikedState);
        setLoading(true);

        try {
            const api_token = await getAccessTokenSilently();

            if (newLikedState) {
                await likeTrack(api_token, track);
            } else {
                await unlikeTrack(api_token, spotifyTrackId);
            }

            // Notify parent of change
            if (onLikeChange) {
                onLikeChange(spotifyTrackId, newLikedState);
            }
        } catch (err) {
            console.error('Failed to update like status:', err);
            // Revert on error
            setLiked(!newLikedState);
        } finally {
            setLoading(false);
        }
    };

    if (!spotifyTrackId) return null;

    return (
        <Tooltip title={liked ? "Remove from liked" : "Add to liked"}>
            <IconButton
                size="small"
                onClick={handleClick}
                disabled={loading}
                sx={{
                    color: liked ? 'error.main' : 'custom.primaryGlow',
                    '&:hover': {
                        color: liked ? 'error.dark' : 'error.light',
                        backgroundColor: 'custom.primarySubtle',
                    },
                    transition: 'color 0.2s ease',
                }}
            >
                {liked ? (
                    <FavoriteIcon fontSize="small" />
                ) : (
                    <FavoriteBorderIcon fontSize="small" />
                )}
            </IconButton>
        </Tooltip>
    );
};

export default LikeButton;
