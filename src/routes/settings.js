import { Box, Card, CardActions, CardContent, CardMedia, CircularProgress, Container, Icon, IconButton, Menu, MenuItem, Paper, Stack, Typography } from "@mui/material";
import AppHeader from "../components/AppHeader";
import StravaLogo from "../images/strava-2.svg";
import SpotifyLogo from "../images/spotify-2.svg";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useEffect, useState } from "react";
import { disconnectService, getUserConfig } from "../services/auth0";
import { useAuth0 } from "@auth0/auth0-react";
import { disconnectSpotifyAccount } from "../services/spotify";
import { disconnectStravaAccount } from "../services/strava";

export default function Settings(props) {

    return (
        <>
            <AppHeader />
            <Container sx={{ p:3 }}>
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

    useEffect(() => {

        const fetchData = async () => {
            const api_token = await getAccessTokenSilently();
            const connectedServices = await getUserConfig(api_token);

            // if user has strava connection
            if (connectedServices.connections.strava) {
                setStravaConnected(true);
            }

            // if user has spotify connection
            if (connectedServices.connections.spotify) {
                setSpotifyConnected(true);
            }

            setIsLoading(false);
        }

        fetchData();

    })

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
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: 1 }}>
                        <Typography sx={{ p: 1 }} variant="body2">{spotifyConnected ? 'Connected' : 'Disconnected'}</Typography>
                    </Box>
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

                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: 1 }}>
                        <Typography sx={{ p: 1 }} variant="body2">{stravaConnected ? 'Connected' : 'Disconnected'}</Typography>
                    </Box>

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
                </Card>

            </Stack>
        </>
    )
}