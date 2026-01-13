import { Box, Button, Card, CardContent, CardMedia, CircularProgress, Container, FormControlLabel, IconButton, Menu, MenuItem, Stack, Switch, Typography } from "@mui/material";
import AppHeader from "../components/AppHeader";
import StravaLogo from "../images/strava-2.svg";
import SpotifyLogo from "../images/spotify-2.svg";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LinkIcon from '@mui/icons-material/Link';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useEffect, useState } from "react";
import { disconnectService, getUserConfig, updateUserConfig } from "../services/auth0";
import { useAuth0 } from "@auth0/auth0-react";
import { strava_scopes } from "../services/strava";
import { spotify_scopes } from "../services/spotify";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export default function Settings(props) {

    return (
        <>
            <AppHeader />
            <Container sx={{ p: 3 }}>
                <SettingsContent />
            </Container>
        </>
    )
}

const SettingsContent = () => {

    const [isLoading, setIsLoading] = useState(true);
    const { getAccessTokenSilently } = useAuth0();
    const [stravaConnected, setStravaConnected] = useState(false);
    const [spotifyConnected, setSpotifyConnected] = useState(false);

    const [spotifyAnchorEl, setSpotifyAnchorEl] = useState(null);
    const [stravaAnchorEl, setStravaAnchorEl] = useState(null);

    const spotifyOpen = Boolean(spotifyAnchorEl);
    const stravaOpen = Boolean(stravaAnchorEl);


    const [accessToken, setAccessToken] = useState('');
    const [stravaDescriptionEnabled, setStravaDescriptionEnabled] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    // Build OAuth URLs
    const stravaAuthUrl = new URL('https://www.strava.com/oauth/authorize');
    stravaAuthUrl.searchParams.append("client_id", process.env.REACT_APP_STRAVA_CLIENT_ID);
    stravaAuthUrl.searchParams.append("response_type", "code");
    stravaAuthUrl.searchParams.append("approval_prompt", "force");
    stravaAuthUrl.searchParams.append("scope", strava_scopes);
    stravaAuthUrl.searchParams.append("redirect_uri", process.env.REACT_APP_STRAVA_REDIRECT_URI);

    const spotifyAuthUrl = new URL('https://accounts.spotify.com/authorize');
    spotifyAuthUrl.searchParams.append("client_id", process.env.REACT_APP_SPOTIFY_CLIENT_ID);
    spotifyAuthUrl.searchParams.append("response_type", "code");
    spotifyAuthUrl.searchParams.append("scope", spotify_scopes);
    spotifyAuthUrl.searchParams.append("redirect_uri", process.env.REACT_APP_SPOTIFY_REDIRECT_URI);


    const handleClose = () => {
        setSpotifyAnchorEl(null);
        setStravaAnchorEl(null);
    };

    const handleClick = (event) => {
        if (event.currentTarget.id === 'spotify-menu') {
            setSpotifyAnchorEl(event.currentTarget);
        }
        if (event.currentTarget.id === 'strava-menu') {
            setStravaAnchorEl(event.currentTarget);
        }
    };

    const handleDisconnectSpotify = async () => {
        handleClose()
        const api_token = await getAccessTokenSilently();
        await disconnectService(api_token, "spotify");
        setSpotifyConnected(false);
    }

    const handleDisconnectStrava = async () => {
        handleClose()
        const api_token = await getAccessTokenSilently();
        await disconnectService(api_token, "strava");
        setStravaConnected(false);
    }

    const handleStravaDescriptionToggle = async (event) => {
        const newValue = event.target.checked;
        setStravaDescriptionEnabled(newValue);
        const api_token = await getAccessTokenSilently();
        await updateUserConfig(api_token, { strava_description_enabled: newValue });
    }

    useEffect(() => {
        const fetchData = async () => {
            const api_token = await getAccessTokenSilently({
                audience: process.env.REACT_APP_AUTH0_AUDIENCE // or hardcode your audience if needed
            });

            const connectedServices = await getUserConfig(api_token);
            if (connectedServices.strava) setStravaConnected(true);
            if (connectedServices.spotify) setSpotifyConnected(true);
            setStravaDescriptionEnabled(connectedServices.strava_description_enabled);

            setAccessToken(api_token);
            setIsAdmin(connectedServices.is_admin === true);

            setIsLoading(false);
        };

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress color="secondary" sx={{ margin: 20 }} />
            </Box>
        )
    }

    return (
        <>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>Services</Typography>
            <Stack spacing={2} sx={{ p: 2 }} alignItems="center">

                <Card sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                    <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                        <CardMedia
                            component="img"
                            sx={{ width: 25, height: 25, marginLeft: 1, borderRadius: 50 }}
                            image={SpotifyLogo}
                        />
                        <Typography sx={{ p: 1, width: '100%' }} variant="body2">Spotify</Typography>
                    </CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: 1, gap: 1 }}>
                        {spotifyConnected ? (
                            <>
                                <CheckCircleIcon sx={{ color: 'success.main', fontSize: 18 }} />
                                <Typography variant="body2" sx={{ color: 'success.main' }}>Connected</Typography>
                            </>
                        ) : (
                            <Button
                                href={spotifyAuthUrl.toString()}
                                variant="outlined"
                                size="small"
                                startIcon={<LinkIcon />}
                                sx={{ whiteSpace: 'nowrap' }}
                            >
                                Connect Spotify
                            </Button>
                        )}
                    </Box>
                    {spotifyConnected && (
                        <>
                            <IconButton id="spotify-menu" aria-label="settings" sx={{ marginRight: 2 }} aria-haspopup="true"
                                aria-expanded={spotifyOpen ? 'true' : undefined} onClick={handleClick} aria-controls={spotifyOpen ? 'basic-menu' : undefined}>
                                <MoreVertIcon />
                            </IconButton>
                            <Menu
                                anchorEl={spotifyAnchorEl}
                                open={spotifyOpen}
                                onClose={handleClose}
                                MenuListProps={{
                                    'aria-labelledby': 'basic-button',
                                }}
                            >
                                <MenuItem onClick={handleDisconnectSpotify}>Disconnect Spotify</MenuItem>
                            </Menu>
                        </>
                    )}
                </Card>

                <Card sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                    <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                        <CardMedia
                            component="img"
                            sx={{ width: 25, height: 25, marginLeft: 1, borderRadius: 50 }}
                            image={StravaLogo}
                        />
                        <Typography sx={{ p: 1, width: '100%' }} variant="body2">Strava</Typography>
                    </CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: 1, gap: 1 }}>
                        {stravaConnected ? (
                            <>
                                <CheckCircleIcon sx={{ color: 'success.main', fontSize: 18 }} />
                                <Typography variant="body2" sx={{ color: 'success.main' }}>Connected</Typography>
                            </>
                        ) : (
                            <Button
                                href={stravaAuthUrl.toString()}
                                variant="outlined"
                                size="small"
                                startIcon={<LinkIcon />}
                                sx={{ whiteSpace: 'nowrap' }}
                            >
                                Connect Strava
                            </Button>
                        )}
                    </Box>
                    {stravaConnected && (
                        <>
                            <IconButton id="strava-menu" aria-label="settings" sx={{ marginRight: 2 }} aria-haspopup="true"
                                aria-expanded={stravaOpen ? 'true' : undefined} onClick={handleClick} aria-controls={stravaOpen ? 'basic-menu' : undefined}>
                                <MoreVertIcon />
                            </IconButton>
                            <Menu
                                anchorEl={stravaAnchorEl}
                                open={stravaOpen}
                                onClose={handleClose}
                                MenuListProps={{
                                    'aria-labelledby': 'basic-button',
                                }}
                            >
                                <MenuItem onClick={handleDisconnectStrava}>Disconnect Strava</MenuItem>
                            </Menu>
                        </>
                    )}
                </Card>

            </Stack>

            {stravaConnected && (
                <>
                    <Typography variant="h6" sx={{ fontWeight: 800, mt: 3 }}>Preferences</Typography>
                    <Stack spacing={2} sx={{ p: 2 }} alignItems="center">
                        <Card sx={{ width: '100%' }}>
                            <CardContent>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={stravaDescriptionEnabled}
                                            onChange={handleStravaDescriptionToggle}
                                            color="primary"
                                        />
                                    }
                                    label="Add tracklist to Strava activity description"
                                />
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    When enabled, your Spotify tracklist will be automatically added to your Strava activity description.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Stack>
                </>
            )}

            {isAdmin && (
                <>
                    <Typography variant="h6" sx={{ fontWeight: 800, mt: 3 }}>Admin</Typography>
                    <Stack spacing={2} sx={{ p: 2 }} alignItems="center">
                        <Card sx={{ width: '100%' }}>
                            <CardContent>
                                <Button
                                    variant="outlined"
                                    startIcon={<ContentCopyIcon />}
                                    onClick={() => navigator.clipboard.writeText(accessToken)}
                                    sx={{ width: 'fit-content' }}
                                >
                                    Copy Access Token
                                </Button>
                            </CardContent>
                        </Card>
                    </Stack>
                </>
            )}
        </>
    )
}