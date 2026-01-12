import { useAuth0 } from "@auth0/auth0-react";
import {
    Box,
    CircularProgress,
    Container,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Typography,
    Tooltip,
    TextField,
    InputAdornment
} from "@mui/material";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useEffect, useState } from "react";
import AppHeader from "../components/AppHeader";
import LikeButton from "../components/LikeButton";
import AddToPlaylistButton from "../components/AddToPlaylistButton";
import { getLikedTracks } from "../services/likedTracks";
import { getUserConfig } from "../services/auth0";
import { spotify_scopes_with_playlists } from "../services/spotify";
import { useAudio } from "../contexts/AudioContext";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

export default function LikedTracksPage() {
    const { getAccessTokenSilently, isAuthenticated } = useAuth0();
    const [tracks, setTracks] = useState([]);
    const [filteredTracks, setFilteredTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [userConfig, setUserConfig] = useState(null);
    const { currentTrack, isPlaying, play, togglePlayPause } = useAudio();

    useEffect(() => {
        const fetchData = async () => {
            if (!isAuthenticated) return;

            try {
                const api_token = await getAccessTokenSilently();
                const [likedTracks, config] = await Promise.all([
                    getLikedTracks(api_token),
                    getUserConfig(api_token)
                ]);
                setTracks(likedTracks);
                setFilteredTracks(likedTracks);
                setUserConfig(config);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isAuthenticated, getAccessTokenSilently]);

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(event.target.value);
        setFilteredTracks(
            tracks.filter(track =>
                track.name.toLowerCase().includes(query) ||
                track.artist.toLowerCase().includes(query) ||
                track.album.toLowerCase().includes(query)
            )
        );
    };

    const handleLikeChange = (spotifyTrackId, isLiked) => {
        if (!isLiked) {
            // Remove from list when unliked
            setTracks(prev => prev.filter(t => t.spotify_track_id !== spotifyTrackId));
            setFilteredTracks(prev => prev.filter(t => t.spotify_track_id !== spotifyTrackId));
        }
    };

    const handlePlayToggle = (track) => {
        const isCurrentTrack = currentTrack?.spotify_url === track.spotify_url;
        if (isCurrentTrack) {
            togglePlayPause();
        } else {
            // Convert to format expected by audio context
            play({
                ...track,
                preview_url: track.preview_url || null
            });
        }
    };

    const isTrackPlaying = (track) => {
        return isPlaying && currentTrack?.spotify_url === track.spotify_url;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const handleReauthRequired = () => {
        // Redirect to Spotify auth with playlist scopes
        window.location.href = `/spotify_auth?scopes=${encodeURIComponent(spotify_scopes_with_playlists)}`;
    };

    return (
        <>
            <AppHeader />
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <FavoriteIcon sx={{ color: 'error.main', fontSize: 32 }} />
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        Liked Tracks
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {tracks.length} {tracks.length === 1 ? 'track' : 'tracks'}
                    </Typography>
                </Box>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress />
                    </Box>
                ) : tracks.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <Typography variant="body1" color="text.secondary">
                            No liked tracks yet. Like tracks from your activities to see them here.
                        </Typography>
                    </Box>
                ) : (
                    <>
                        <TextField
                            size="small"
                            placeholder="Search tracks..."
                            value={searchQuery}
                            onChange={handleSearch}
                            fullWidth
                            sx={{ mb: 2 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <List sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
                            {filteredTracks.map((track) => (
                                <ListItem
                                    key={track.spotify_track_id}
                                    sx={{
                                        borderBottom: '1px solid',
                                        borderColor: 'divider',
                                        '&:last-child': { borderBottom: 'none' }
                                    }}
                                    secondaryAction={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <LikeButton
                                                track={track}
                                                isLiked={true}
                                                onLikeChange={handleLikeChange}
                                            />
                                            {track.spotify_url && userConfig && (
                                                <AddToPlaylistButton
                                                    track={track}
                                                    spotifyOAuthAllows={userConfig.spotify_oauth_allows || []}
                                                    onReauthRequired={handleReauthRequired}
                                                />
                                            )}
                                            {track.spotify_url && (
                                                <Tooltip title="Open in Spotify">
                                                    <IconButton
                                                        size="small"
                                                        component="a"
                                                        href={track.spotify_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        sx={{
                                                            color: 'custom.primaryGlow',
                                                            '&:hover': {
                                                                color: 'primary.light',
                                                                backgroundColor: 'custom.primarySubtle',
                                                            },
                                                        }}
                                                    >
                                                        <OpenInNewIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </Box>
                                    }
                                >
                                    <IconButton
                                        size="small"
                                        onClick={() => handlePlayToggle(track)}
                                        sx={{ mr: 1 }}
                                    >
                                        {isTrackPlaying(track) ? (
                                            <PauseIcon fontSize="small" />
                                        ) : (
                                            <PlayArrowIcon fontSize="small" />
                                        )}
                                    </IconButton>
                                    <ListItemAvatar>
                                        <Avatar
                                            variant="rounded"
                                            src={track.album_image}
                                            alt={track.album}
                                            sx={{ width: 48, height: 48 }}
                                        >
                                            {track.name?.charAt(0)}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={track.name}
                                        secondary={
                                            <>
                                                {track.artist} • {track.album}
                                                <Typography
                                                    component="span"
                                                    variant="caption"
                                                    sx={{ display: 'block', color: 'text.disabled' }}
                                                >
                                                    Liked {formatDate(track.liked_at)}
                                                </Typography>
                                            </>
                                        }
                                        primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                                        secondaryTypographyProps={{ variant: 'caption' }}
                                        sx={{ mr: 8 }}
                                    />
                                </ListItem>
                            ))}
                        </List>

                        {filteredTracks.length === 0 && searchQuery && (
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                <Typography variant="body2" color="text.secondary">
                                    No tracks match "{searchQuery}"
                                </Typography>
                            </Box>
                        )}
                    </>
                )}
            </Container>
        </>
    );
}
