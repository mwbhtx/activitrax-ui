import { createPortal } from 'react-dom';
import { Avatar, Box, IconButton, Paper, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import CloseIcon from '@mui/icons-material/Close';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { useAudio } from '../contexts/AudioContext';
import LikeButton from './LikeButton';

const MiniPlayer = () => {
    const {
        currentTrack,
        isPlaying,
        progress,
        isVisible,
        togglePlayPause,
        stop,
    } = useAudio();

    if (!isVisible) return null;

    const playerContent = (
        <Box
            sx={{
                // Full-width fixed container - most reliable for mobile
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 9999,
                // Padding creates the floating effect
                p: 2,
                pb: 'calc(16px + env(safe-area-inset-bottom, 0px))',
                // Desktop: limit width and position left
                '@media (min-width: 601px)': {
                    right: 'auto',
                    width: 532, // 500 + 32 padding
                },
            }}
        >
            <Paper
                elevation={8}
                sx={{
                    borderRadius: 2,
                    overflow: 'hidden',
                    backgroundColor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'custom.border',
                }}
            >
                {/* Progress bar */}
                <Box
                    sx={{
                        height: 3,
                        backgroundColor: 'divider',
                        position: 'relative',
                    }}
                >
                    <Box
                        sx={{
                            height: '100%',
                            width: `${progress}%`,
                            backgroundColor: 'primary.light',
                            transition: 'width 0.1s linear',
                            boxShadow: (theme) => `0 0 8px ${theme.palette.custom.primaryGlow}`,
                        }}
                    />
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 1.5,
                        gap: 1.5,
                    }}
                >
                    {/* Play/Pause button */}
                    <IconButton
                        onClick={togglePlayPause}
                        sx={{
                            backgroundColor: 'primary.main',
                            color: 'primary.contrastText',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                backgroundColor: 'primary.dark',
                                transform: 'scale(1.05)',
                            },
                        }}
                    >
                        {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                    </IconButton>

                    {/* Album art */}
                    <Avatar
                        variant="rounded"
                        src={currentTrack?.album_image}
                        alt={currentTrack?.album}
                        sx={{
                            width: 48,
                            height: 48,
                            boxShadow: (theme) => `0 4px 12px ${theme.palette.custom.overlay}`,
                        }}
                    >
                        {!currentTrack?.album_image && <MusicNoteIcon />}
                    </Avatar>

                    {/* Track info */}
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography variant="body2" noWrap sx={{ fontWeight: 600, color: 'text.primary' }}>
                            {currentTrack?.name}
                        </Typography>
                        <Typography variant="caption" noWrap sx={{ color: 'text.secondary' }}>
                            {currentTrack?.artist}
                        </Typography>
                    </Box>

                    {/* Like button */}
                    {currentTrack && (
                        <LikeButton
                            track={currentTrack}
                            isLiked={false}
                        />
                    )}

                    {/* Close */}
                    <IconButton
                        onClick={stop}
                        size="small"
                        sx={{
                            color: 'text.secondary',
                            '&:hover': {
                                color: 'text.primary',
                                backgroundColor: 'custom.border',
                            },
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
            </Paper>
        </Box>
    );

    return createPortal(playerContent, document.body);
};

export default MiniPlayer;
