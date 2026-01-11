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
                    backgroundColor: 'rgba(30, 30, 30, 0.9)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRight: '1px solid rgba(255, 255, 255, 0.08)',
                }}
            >
                {/* Progress bar */}
                <Box
                    sx={{
                        height: 3,
                        backgroundColor: 'rgba(255, 138, 101, 0.15)',
                        position: 'relative',
                    }}
                >
                    <Box
                        sx={{
                            height: '100%',
                            width: `${progress}%`,
                            backgroundColor: '#FF8A65',
                            transition: 'width 0.1s linear',
                            boxShadow: '0 0 8px rgba(255, 138, 101, 0.5)',
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
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                        }}
                    >
                        {!currentTrack?.album_image && <MusicNoteIcon />}
                    </Avatar>

                    {/* Track info */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" noWrap sx={{ fontWeight: 600, color: '#ffffff' }}>
                            {currentTrack?.name}
                        </Typography>
                        <Typography variant="caption" noWrap sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                            {currentTrack?.artist}
                        </Typography>
                    </Box>

                    {/* Controls */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {/* Play/Pause */}
                        <IconButton
                            onClick={togglePlayPause}
                            sx={{
                                backgroundColor: '#FF8A65',
                                color: '#000',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    backgroundColor: '#E64A19',
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
                                color: 'rgba(255, 255, 255, 0.6)',
                                '&:hover': {
                                    color: '#ffffff',
                                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
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
