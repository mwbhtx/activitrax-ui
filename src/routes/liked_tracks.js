import { useAuth0 } from "@auth0/auth0-react";
import {
    Box,
    CircularProgress,
    Container,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Typography,
    Tooltip,
    TextField,
    InputAdornment,
    IconButton
} from "@mui/material";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useEffect, useState } from "react";
import AppHeader from "../components/AppHeader";
import LikeButton from "../components/LikeButton";
import { getLikedTracks } from "../services/likedTracks";
import { useAudio } from "../contexts/AudioContext";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

const PlayButton = ({ isPlaying, onPlayToggle, hasPreview }) => {
    const { progress } = useAudio();

    if (!hasPreview) {
        return <Box sx={{ width: 36, height: 36, mr: 1.5 }} />;
    }

    return (
        <Tooltip title={isPlaying ? "Pause preview" : "Play 30s preview"}>
            <Box
                onClick={(e) => { e.stopPropagation(); onPlayToggle(); }}
                sx={{
                    position: 'relative',
                    width: 36,
                    height: 36,
                    mr: 1.5,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {/* Background circle */}
                <CircularProgress
                    variant="determinate"
                    value={100}
                    size={36}
                    thickness={3}
                    sx={{
                        position: 'absolute',
                        color: isPlaying ? 'custom.progressBg' : 'custom.progressBgDim',
                    }}
                />
                {/* Progress circle */}
                {isPlaying && (
                    <CircularProgress
                        variant="determinate"
                        value={progress}
                        size={36}
                        thickness={3}
                        sx={{
                            position: 'absolute',
                            color: 'primary.light',
                            transition: 'none',
                        }}
                    />
                )}
                {/* Play/Pause icon */}
                <Box
                    sx={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        backgroundColor: 'primary.light',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'transform 0.15s ease',
                        '&:hover': {
                            transform: 'scale(1.1)',
                        },
                    }}
                >
                    {isPlaying ? (
                        <PauseIcon sx={{ color: 'text.primary', fontSize: 18 }} />
                    ) : (
                        <PlayArrowIcon sx={{ color: 'text.primary', fontSize: 18, ml: '2px' }} />
                    )}
                </Box>
            </Box>
        </Tooltip>
    );
};

export default function LikedTracksPage() {
    const { getAccessTokenSilently, isAuthenticated } = useAuth0();
    const [tracks, setTracks] = useState([]);
    const [filteredTracks, setFilteredTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const { currentTrack, isPlaying, play, togglePlayPause } = useAudio();

    useEffect(() => {
        const fetchData = async () => {
            if (!isAuthenticated) return;

            try {
                const api_token = await getAccessTokenSilently();
                const likedTracks = await getLikedTracks(api_token);
                setTracks(likedTracks);
                setFilteredTracks(likedTracks);
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
                                    <PlayButton
                                        isPlaying={isTrackPlaying(track)}
                                        onPlayToggle={() => handlePlayToggle(track)}
                                        hasPreview={!!track.preview_url}
                                    />
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
