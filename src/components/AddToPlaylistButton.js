import React, { useState, useRef } from 'react';
import {
    IconButton,
    Popover,
    Box,
    TextField,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Typography,
    CircularProgress,
    Button,
    InputAdornment
} from '@mui/material';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import SearchIcon from '@mui/icons-material/Search';
import CheckIcon from '@mui/icons-material/Check';
import { useAuth0 } from '@auth0/auth0-react';
import { getSpotifyPlaylists, addTrackToPlaylist, spotify_scopes_with_playlists } from '../services/spotify';

const AddToPlaylistButton = ({ track, spotifyOAuthAllows = [], onReauthRequired }) => {
    const { getAccessTokenSilently } = useAuth0();
    const [anchorEl, setAnchorEl] = useState(null);
    const [playlists, setPlaylists] = useState([]);
    const [filteredPlaylists, setFilteredPlaylists] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [adding, setAdding] = useState(null); // playlistId being added to
    const [addedTo, setAddedTo] = useState(new Set()); // playlistIds successfully added to
    const [error, setError] = useState(null);
    const buttonRef = useRef(null);

    const hasPlaylistPermission = spotifyOAuthAllows.includes('playlist-modify-private');

    const handleClick = async (event) => {
        event.stopPropagation();

        if (!hasPlaylistPermission) {
            // Show reauth popup
            setAnchorEl(event.currentTarget);
            return;
        }

        setAnchorEl(event.currentTarget);
        setLoading(true);
        setError(null);

        try {
            const api_token = await getAccessTokenSilently();
            const fetchedPlaylists = await getSpotifyPlaylists(api_token);
            setPlaylists(fetchedPlaylists);
            setFilteredPlaylists(fetchedPlaylists);
        } catch (err) {
            console.error('Failed to fetch playlists:', err);
            setError('Failed to load playlists');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setAnchorEl(null);
        setSearchQuery('');
        setFilteredPlaylists(playlists);
        setError(null);
    };

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(event.target.value);
        setFilteredPlaylists(
            playlists.filter(p => p.name.toLowerCase().includes(query))
        );
    };

    const handleAddToPlaylist = async (playlistId) => {
        if (!track.spotify_url) return;

        // Extract track URI from spotify URL
        // URL format: https://open.spotify.com/track/TRACK_ID
        const trackId = track.spotify_url.split('/track/')[1]?.split('?')[0];
        if (!trackId) return;

        const trackUri = `spotify:track:${trackId}`;

        setAdding(playlistId);
        try {
            const api_token = await getAccessTokenSilently();
            await addTrackToPlaylist(api_token, playlistId, trackUri);
            setAddedTo(prev => new Set([...prev, playlistId]));
        } catch (err) {
            console.error('Failed to add track:', err);
            setError('Failed to add track');
        } finally {
            setAdding(null);
        }
    };

    const handleReauth = () => {
        const spotifyClientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
        const redirectUri = process.env.REACT_APP_SPOTIFY_REDIRECT_URI;
        const authUrl = `https://accounts.spotify.com/authorize?client_id=${spotifyClientId}&response_type=code&scope=${encodeURIComponent(spotify_scopes_with_playlists)}&redirect_uri=${encodeURIComponent(redirectUri)}`;
        window.location.href = authUrl;
    };

    const open = Boolean(anchorEl);

    return (
        <>
            <IconButton
                ref={buttonRef}
                size="small"
                onClick={handleClick}
                sx={{
                    color: 'custom.primaryGlow',
                    '&:hover': {
                        color: 'primary.light',
                        backgroundColor: 'custom.primarySubtle',
                    },
                }}
            >
                <PlaylistAddIcon fontSize="small" />
            </IconButton>

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                slotProps={{
                    paper: {
                        sx: {
                            width: 300,
                            maxHeight: 400,
                            backgroundColor: 'background.paper',
                        }
                    }
                }}
            >
                {!hasPlaylistPermission ? (
                    // Reauth prompt
                    <Box sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                            To save tracks to playlists, we need additional Spotify permissions.
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleReauth}
                            fullWidth
                        >
                            Connect Spotify
                        </Button>
                    </Box>
                ) : (
                    // Playlist selector
                    <Box>
                        <Box sx={{ p: 1, borderBottom: 1, borderColor: 'divider' }}>
                            <TextField
                                size="small"
                                placeholder="Find a playlist"
                                value={searchQuery}
                                onChange={handleSearch}
                                fullWidth
                                autoFocus
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon fontSize="small" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>

                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                <CircularProgress size={24} />
                            </Box>
                        ) : error ? (
                            <Box sx={{ p: 2, textAlign: 'center' }}>
                                <Typography variant="body2" color="error">
                                    {error}
                                </Typography>
                            </Box>
                        ) : (
                            <List sx={{ maxHeight: 300, overflow: 'auto', py: 0 }}>
                                {filteredPlaylists.length === 0 ? (
                                    <ListItem>
                                        <ListItemText
                                            primary="No playlists found"
                                            primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                                        />
                                    </ListItem>
                                ) : (
                                    filteredPlaylists.map((playlist) => (
                                        <ListItem
                                            key={playlist.id}
                                            button
                                            onClick={() => handleAddToPlaylist(playlist.id)}
                                            disabled={adding === playlist.id}
                                            sx={{
                                                '&:hover': {
                                                    backgroundColor: 'action.hover',
                                                },
                                            }}
                                        >
                                            <ListItemAvatar>
                                                <Avatar
                                                    variant="rounded"
                                                    src={playlist.image}
                                                    sx={{ width: 40, height: 40 }}
                                                >
                                                    {playlist.name?.charAt(0)}
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={playlist.name}
                                                secondary={`${playlist.tracks_count} tracks`}
                                                primaryTypographyProps={{ variant: 'body2', noWrap: true }}
                                                secondaryTypographyProps={{ variant: 'caption' }}
                                            />
                                            {adding === playlist.id ? (
                                                <CircularProgress size={20} />
                                            ) : addedTo.has(playlist.id) ? (
                                                <CheckIcon color="success" fontSize="small" />
                                            ) : null}
                                        </ListItem>
                                    ))
                                )}
                            </List>
                        )}
                    </Box>
                )}
            </Popover>
        </>
    );
};

export default AddToPlaylistButton;
