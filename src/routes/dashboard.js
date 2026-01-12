import { useAuth0 } from "@auth0/auth0-react";
import { Avatar, Box, Button, CircularProgress, Collapse, Container, IconButton, List, ListItem, ListItemAvatar, ListItemText, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useEffect, useState } from "react";
import AppHeader from "../components/AppHeader";
import SpotifyLogo from '../images/spotify-2.svg';
import StravaLogo from '../images/strava-2.svg';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

import { strava_scopes } from "../services/strava";
import { getUserConfig, getUserActivities, getActivityTracklist } from "../services/auth0";
import { spotify_scopes } from "../services/spotify";
import { useAudio } from "../contexts/AudioContext";

// Activity processing status constants (must match backend)
const ACTIVITY_STATUS = {
    PROCESSING: 'processing',
    SUCCESS: 'success',
    NO_SPOTIFY: 'no_spotify',
    SPOTIFY_ERROR: 'spotify_error',
    NO_TRACKS: 'no_tracks',
    STRAVA_UPDATE_ERROR: 'strava_update_error'
};

// Status display configuration using theme colors
const getStatusConfig = (status) => {
    switch (status) {
        case ACTIVITY_STATUS.SUCCESS:
            return {
                label: 'Added',
                icon: <CheckCircleIcon fontSize="small" />,
                tooltip: 'Tracklist added to your Strava activity',
                sx: { borderColor: 'success.main', color: 'success.main' }
            };
        case ACTIVITY_STATUS.PROCESSING:
            return {
                label: 'Processing',
                icon: <HourglassEmptyIcon fontSize="small" />,
                tooltip: 'Fetching your tracks from Spotify',
                sx: { borderColor: 'text.disabled', color: 'text.disabled' }
            };
        case ACTIVITY_STATUS.NO_SPOTIFY:
            return {
                label: 'Not Connected',
                icon: <WarningIcon fontSize="small" />,
                tooltip: 'Spotify was not connected when this activity was recorded',
                sx: { borderColor: 'warning.light', color: 'warning.light' }
            };
        case ACTIVITY_STATUS.SPOTIFY_ERROR:
            return {
                label: 'Spotify Error',
                icon: <ErrorIcon fontSize="small" />,
                tooltip: 'Failed to fetch tracks from Spotify',
                sx: { borderColor: 'error.light', color: 'error.light' }
            };
        case ACTIVITY_STATUS.NO_TRACKS:
            return {
                label: 'No Music',
                icon: <WarningIcon fontSize="small" />,
                tooltip: 'No Spotify tracks were playing during this activity',
                sx: { borderColor: 'text.muted', color: 'text.muted' }
            };
        case ACTIVITY_STATUS.STRAVA_UPDATE_ERROR:
            return {
                label: 'Strava Error',
                icon: <ErrorIcon fontSize="small" />,
                tooltip: 'Tracks were saved but failed to update Strava description',
                sx: { borderColor: 'error.light', color: 'error.light' }
            };
        default:
            return {
                label: 'Pending',
                icon: null,
                tooltip: 'Waiting to process',
                sx: { borderColor: 'text.muted', color: 'text.muted' }
            };
    }
};

export default function Dashboard(props) {

    return (
        <>
            <AppHeader />
            <ServiceConnectDialogue />
        </>
    )
}

const ServiceConnectDialogue = () => {

    const { getAccessTokenSilently, isAuthenticated } = useAuth0();

    const [stravaConnected, setStravaConnected] = useState(false);
    const [spotifyConnected, setSpotifyConnected] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [activities, setActivities] = useState([]);

    useEffect(() => {

        const fetchData = async () => {
            try {
                // get api access token
                const accessToken = await getAccessTokenSilently();

                // get user config
                const userConfig = await getUserConfig(accessToken);

                // if user has strava connection
                if (userConfig.strava) {
                    setStravaConnected(true);
                }

                // if user has spotify connection
                if (userConfig.spotify) {
                    setSpotifyConnected(true);
                }

                // if both services connected, fetch activities
                if (userConfig.strava && userConfig.spotify) {
                    const userActivities = await getUserActivities(accessToken);
                    setActivities(userActivities || []);
                }

                // finally
                setDataLoaded(true);

            } catch (e) {
                console.log(e.message);
            }
        };

        if (isAuthenticated) {
            fetchData();
        }

    }, [getAccessTokenSilently, isAuthenticated]);

    if (!dataLoaded) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress color="secondary" sx={{ margin: 20 }} />
            </Box>
        )
    }


    return (
        <>
            <Container>
                {!stravaConnected && (
                    <>
                        <StravaConnect />
                    </>
                )}
                {!spotifyConnected && (
                    <>
                        <SpotifyConnect />
                    </>
                )}
                {stravaConnected && spotifyConnected && (
                    <>
                        <ActivitiesTable activities={activities} />
                    </>
                )}
            </Container>
        </>
    )
}

const StravaConnect = () => {

    const stravaAuthUrl = new URL('https://www.strava.com/oauth/authorize');
    stravaAuthUrl.searchParams.append("client_id", '75032');
    stravaAuthUrl.searchParams.append("response_type", "code");
    stravaAuthUrl.searchParams.append("approval_prompt", "force");
    stravaAuthUrl.searchParams.append("scope", strava_scopes);
    stravaAuthUrl.searchParams.append("redirect_uri", process.env.REACT_APP_STRAVA_REDIRECT_URI);

    return (
        <Paper
            elevation={0}
            sx={{
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                m: 2,
                p: 4,
                border: '1px solid',
                borderColor: 'custom.border',
                borderRadius: 3,
                maxWidth: 400,
                mx: 'auto',
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Box sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: 'custom.primarySubtle',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <img width={40} height={40} alt="Strava Logo" src={StravaLogo} />
                </Box>
            </Box>
            <Typography variant="body1" sx={{ mb: 3, fontWeight: 400, textAlign: 'center', color: 'text.highlight' }}>
                Connect your Strava account to synchronize activities with your Spotify music.
            </Typography>
            <Button href={`${stravaAuthUrl}`} variant="contained" sx={{ width: '100%' }}>
                Connect Strava
            </Button>
        </Paper>
    )

}


const SpotifyConnect = () => {

    const spotifyAuthUrl = new URL('https://accounts.spotify.com/authorize');
    spotifyAuthUrl.searchParams.append("client_id", '2d496310f6db494791df2b41b9c2342d');
    spotifyAuthUrl.searchParams.append("response_type", "code");
    spotifyAuthUrl.searchParams.append("show_dialog", "true");
    spotifyAuthUrl.searchParams.append("scope", spotify_scopes);
    spotifyAuthUrl.searchParams.append("redirect_uri", process.env.REACT_APP_SPOTIFY_REDIRECT_URI);

    return (
        <Paper
            elevation={0}
            sx={{
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                m: 2,
                p: 4,
                border: '1px solid',
                borderColor: 'custom.border',
                borderRadius: 3,
                maxWidth: 400,
                mx: 'auto',
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Box sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: 'custom.primarySubtle',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <img width={40} height={40} alt="Spotify Logo" src={SpotifyLogo} />
                </Box>
            </Box>
            <Typography variant="body1" sx={{ mb: 3, fontWeight: 400, textAlign: 'center', color: 'text.highlight' }}>
                Connect your Spotify account to synchronize activities with your listening history.
            </Typography>
            <Button href={`${spotifyAuthUrl}`} variant="contained" sx={{ width: '100%', backgroundColor: 'primary.light', color: 'secondary.contrastText', '&:hover': { backgroundColor: 'primary.dark' } }}>
                Connect Spotify
            </Button>
        </Paper>
    )
}

const ActivityStatus = ({ status }) => {
    const isSuccess = status === ACTIVITY_STATUS.SUCCESS;
    const config = getStatusConfig(status);

    return (
        <Tooltip title={config.tooltip} arrow>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                {isSuccess ? (
                    <>
                        <CheckCircleIcon sx={{ color: 'success.main', fontSize: 18 }} />
                        <Typography variant="body2" sx={{ color: 'text.highlight' }}>Processed</Typography>
                    </>
                ) : (
                    <>
                        <ErrorIcon sx={{ color: 'error.light', fontSize: 18 }} />
                        <Typography variant="body2" sx={{ color: 'error.light' }}>{config.label}</Typography>
                    </>
                )}
            </Box>
        </Tooltip>
    );
};

// Helper to format activity data for display
const formatActivity = (activity) => {
    const distanceMiles = activity.distance ? (activity.distance * 0.000621371).toFixed(2) : '0.00';

    let dateFormatted = '';
    let timeFormatted = '';

    if (activity.start_date_local) {
        const date = new Date(activity.start_date_local);
        // Format: DD/MM/YYYY
        dateFormatted = date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        // Format: h:mm AM/PM
        timeFormatted = date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }

    return {
        ...activity,
        distance_miles: distanceMiles,
        start_date_formatted: dateFormatted,
        start_time_formatted: timeFormatted
    };
};

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

const TrackItem = ({ track, isPlaying, onPlayToggle }) => {
    const hasPreview = !!track.preview_url;

    return (
        <ListItem
            sx={{ py: 1, px: 2 }}
            secondaryAction={
                track.spotify_url && (
                    <Tooltip title="Open in Spotify">
                        <IconButton
                            size="small"
                            component="a"
                            href={track.spotify_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
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
                )
            }
        >
            <PlayButton isPlaying={isPlaying} onPlayToggle={onPlayToggle} hasPreview={hasPreview} />
            <ListItemAvatar>
                <Avatar
                    variant="rounded"
                    src={track.album_image}
                    alt={track.album}
                    sx={{ width: 40, height: 40 }}
                >
                    {!track.album_image && track.name?.charAt(0)}
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={track.name}
                secondary={`${track.artist} • ${track.album}`}
                primaryTypographyProps={{ variant: 'body2', noWrap: true }}
                secondaryTypographyProps={{ variant: 'caption', noWrap: true }}
                sx={{ mr: 4 }}
            />
        </ListItem>
    );
};

const ActivityRow = ({ activity, onExpandClick, isExpanded, tracklist, isLoading }) => {
    const formatted = formatActivity(activity);
    const hasTracklist = formatted.track_count > 0;
    const { currentTrack, isPlaying, play, togglePlayPause } = useAudio();

    const handlePlayToggle = (track) => {
        // Check if this track is currently playing
        const isCurrentTrack = currentTrack?.preview_url === track.preview_url;

        if (isCurrentTrack) {
            togglePlayPause();
        } else {
            play(track);
        }
    };

    const isTrackPlaying = (track) => {
        return isPlaying && currentTrack?.preview_url === track.preview_url;
    };

    return (
        <>
            <TableRow
                sx={{
                    '& > *': { borderBottom: isExpanded ? 'none' : undefined },
                    cursor: hasTracklist ? 'pointer' : 'default',
                    '&:hover': hasTracklist ? { backgroundColor: 'action.disabledBackground' } : {}
                }}
                onClick={() => hasTracklist && onExpandClick()}
            >
                <TableCell align="center" sx={{ width: 50 }}>
                    {hasTracklist && (
                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); onExpandClick(); }}>
                            {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    )}
                </TableCell>
                <TableCell align="center">{formatted.name || ""}</TableCell>
                <TableCell align="center">{formatted.start_date_formatted}</TableCell>
                <TableCell align="center">{formatted.start_time_formatted}</TableCell>
                <TableCell align="center">{formatted.type || ""}</TableCell>
                <TableCell align="center">{formatted.distance_miles} mi</TableCell>
                <TableCell align="center">{formatted.track_count ?? '-'}</TableCell>
                <TableCell align="center">
                    <ActivityStatus status={formatted.processing_status} />
                </TableCell>
            </TableRow>
            {hasTracklist && (
                <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                        <Collapse in={isExpanded} timeout={300} unmountOnExit>
                            <Box sx={{ py: 2, px: 4, minHeight: 100 }}>
                                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                                    Tracklist
                                </Typography>
                                {isLoading || tracklist.length === 0 ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 60 }}>
                                        <CircularProgress size={24} sx={{ color: 'primary.main' }} />
                                    </Box>
                                ) : (
                                    <List dense sx={{ bgcolor: 'action.disabledBackground', borderRadius: 2, border: '1px solid', borderColor: 'custom.border' }}>
                                        {tracklist.map((track, index) => (
                                            <TrackItem
                                                key={index}
                                                track={track}
                                                isPlaying={isTrackPlaying(track)}
                                                onPlayToggle={() => handlePlayToggle(track)}
                                            />
                                        ))}
                                    </List>
                                )}
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            )}
        </>
    );
};

const ActivitiesTable = ({ activities }) => {
    const { getAccessTokenSilently } = useAuth0();
    const [expandedId, setExpandedId] = useState(null);
    const [tracklists, setTracklists] = useState({});
    const [loadingId, setLoadingId] = useState(null);

    // Sort activities by start_date descending (newest first)
    const sortedActivities = [...activities].sort((a, b) =>
        new Date(b.start_date) - new Date(a.start_date)
    );

    const handleExpandClick = async (activityId) => {
        if (expandedId === activityId) {
            setExpandedId(null);
            return;
        }

        // If already loaded, expand immediately
        if (tracklists[activityId]) {
            setExpandedId(activityId);
            return;
        }

        // Otherwise, fetch data first, then expand
        setLoadingId(activityId);
        try {
            const token = await getAccessTokenSilently();
            const tracks = await getActivityTracklist(token, activityId);
            setTracklists(prev => ({ ...prev, [activityId]: tracks }));
            // Expand after data is loaded so collapse knows the final height
            setExpandedId(activityId);
        } catch (err) {
            console.error('Failed to fetch tracklist:', err);
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <>
            <Typography variant="h6" sx={{ m: 3, fontWeight: 800 }}>Your Activities</Typography>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="activities table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ width: 50 }} />
                            <TableCell align="center">Activity Title</TableCell>
                            <TableCell align="center">Date</TableCell>
                            <TableCell align="center">Start Time</TableCell>
                            <TableCell align="center">Type</TableCell>
                            <TableCell align="center">Distance</TableCell>
                            <TableCell align="center">Tracks</TableCell>
                            <TableCell align="center">Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedActivities.length > 0 ? (
                            sortedActivities.map((activity) => (
                                <ActivityRow
                                    key={activity.id}
                                    activity={activity}
                                    isExpanded={expandedId === activity.id}
                                    onExpandClick={() => handleExpandClick(activity.id)}
                                    tracklist={tracklists[activity.id] || []}
                                    isLoading={loadingId === activity.id}
                                />
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    <Typography variant="body2" sx={{ py: 2 }}>
                                        No activities yet. Complete a Strava activity while listening to Spotify to see it here!
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}