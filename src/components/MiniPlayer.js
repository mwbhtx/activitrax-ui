import { Avatar, Box, IconButton, Paper, Slide, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import CloseIcon from '@mui/icons-material/Close';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { useAudio } from '../contexts/AudioContext';

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

    return (
        <Slide direction="up" in={isVisible} mountOnEnter unmountOnExit>
            <Paper
                elevation={0}
                sx={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1300,
                    borderRadius: '16px 16px 0 0',
                    overflow: 'hidden',
                    backdropFilter: 'blur(20px)',
                    backgroundColor: 'custom.miniPlayerBg',
                    borderTop: '1px solid',
                    borderTopColor: 'custom.borderLight',
                    borderLeft: '1px solid',
                    borderLeftColor: 'custom.border',
                    borderRight: '1px solid',
                    borderRightColor: 'custom.border',
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
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" noWrap sx={{ fontWeight: 600, color: 'text.primary' }}>
                            {currentTrack?.name}
                        </Typography>
                        <Typography variant="caption" noWrap sx={{ color: 'text.secondary' }}>
                            {currentTrack?.artist}
                        </Typography>
                    </Box>

                    {/* Controls */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {/* Play/Pause */}
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
                </Box>
            </Paper>
        </Slide>
    );
};

export default MiniPlayer;
