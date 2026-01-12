import { Box, Button, IconButton, Link, Typography } from "@mui/material";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SpotifyLogo from '../images/spotify-2.svg';

const STORAGE_KEY = 'spotifyBannerMinimized';

export const getInitialMinimizedState = () => {
    try {
        return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
        return false;
    }
};

export const persistMinimizedState = (minimized) => {
    try {
        localStorage.setItem(STORAGE_KEY, minimized.toString());
    } catch {
        // localStorage unavailable
    }
};

const SpotifyBanner = ({ spotifyAuthUrl, minimized, onToggleMinimized }) => {
    const handleToggle = () => {
        const newState = !minimized;
        persistMinimizedState(newState);
        onToggleMinimized(newState);
    };

    if (minimized) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: 'custom.primaryFaint',
                    border: '1px solid',
                    borderColor: 'custom.border',
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    mt: 3,
                    mb: 3,
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                    '&:hover': {
                        backgroundColor: 'custom.primarySubtle',
                    }
                }}
                onClick={handleToggle}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <img width={20} height={20} alt="Spotify" src={SpotifyLogo} />
                    <Typography variant="body2" color="text.secondary">
                        Spotify not connected
                    </Typography>
                    <Link
                        href={spotifyAuthUrl}
                        onClick={(e) => e.stopPropagation()}
                        sx={{
                            color: 'primary.light',
                            textDecoration: 'none',
                            fontWeight: 500,
                            fontSize: '0.875rem',
                            '&:hover': {
                                textDecoration: 'underline'
                            }
                        }}
                    >
                        Connect
                    </Link>
                </Box>
                <IconButton
                    size="small"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleToggle();
                    }}
                    sx={{ color: 'text.secondary' }}
                >
                    <KeyboardArrowDownIcon fontSize="small" />
                </IconButton>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'custom.primarySubtle',
                border: '1px solid',
                borderColor: 'custom.border',
                borderRadius: 2,
                p: 2.5,
                mt: 3,
                mb: 3,
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: 'custom.primaryFaint',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <img width={28} height={28} alt="Spotify" src={SpotifyLogo} />
                </Box>
                <Box>
                    <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary' }}>
                        Connect Spotify
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Link your Spotify account to match your listening history with activities.
                    </Typography>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                    href={spotifyAuthUrl}
                    variant="contained"
                    size="small"
                    sx={{
                        whiteSpace: 'nowrap'
                    }}
                >
                    Connect Spotify
                </Button>
                <IconButton
                    size="small"
                    onClick={handleToggle}
                    sx={{ color: 'text.secondary' }}
                >
                    <KeyboardArrowUpIcon fontSize="small" />
                </IconButton>
            </Box>
        </Box>
    );
};

export default SpotifyBanner;
