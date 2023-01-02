import { useAuth0 } from "@auth0/auth0-react";
import { Box, Button, Card, CardContent, CardMedia, CircularProgress, Container, Paper, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import AppHeader from "../components/AppHeader";
import SpotifyLogo from '../images/spotify-2.svg';
import StravaLogo from '../images/strava-2.svg';

import { useGetStravaAuthToken } from "../services/strava";
import { useNavigate } from "react-router";
import { getUserConfig } from "../services/auth0";

export default function Dashboard(props) {

    return (
        <>
            <AppHeader />
            <Container sx={{ display: 'flex', p: 3, justifyContent: 'center' }}>
                <ServiceConnectDialogue />
            </Container>
        </>
    )
}

const ServiceConnectDialogue = () => {


    const { getAccessTokenSilently, isAuthenticated, user } = useAuth0();

    const [accessToken, setAccessToken] = useState(null);
    const [stravaConnected, setStravaConnected] = useState(false);
    const [spotifyConnected, setSpotifyConnected] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);

    useEffect(() => {

        const fetchData = async () => {
            try {

                // get api access token
                const accessToken = await getAccessTokenSilently();
                setAccessToken(accessToken);

                // get user config
                const userConfig = await getUserConfig(accessToken);

                // if user has strava connection
                if (userConfig.connections.strava) {
                    setStravaConnected(true);
                }

                // if user has spotify connection
                if (userConfig.connections.spotify) {
                    setSpotifyConnected(true);
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
                    <LatestStravaActivity />
                </>
            )}
        </>
    )
}

const StravaConnect = () => {

    const stravaAuthUrl = new URL('https://www.strava.com/oauth/authorize');
    stravaAuthUrl.searchParams.append("client_id", '75032');
    stravaAuthUrl.searchParams.append("response_type", "code");
    stravaAuthUrl.searchParams.append("approval_prompt", "auto");
    stravaAuthUrl.searchParams.append("scope", "read_all,profile:read_all,profile:write,activity:read_all,activity:write");
    stravaAuthUrl.searchParams.append("redirect_uri", process.env.REACT_APP_ACTIVITRAX_STRAVA_REDIRECT_URI);

    return (
        <>
            <Paper elevation={0} sx={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', width: '350px', height: '50', m: 2, p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <img width={50} height={50} alt="Strava Logo" src={StravaLogo} />
                </Box>
                <Typography variant="body2" sx={{ m: 3, fontSize: 16, fontWeight: 400, textAlign: 'center' }}>
                    A connection to your Strava account is required to synchronize your Strava activities with your Spotify music.
                </Typography>
                <Button href={`${stravaAuthUrl}`} variant="contained" sx={{ width: '100%', whiteSpace: 'nowrap' }}>Connect Strava</Button>
            </Paper>
        </>
    )

}


const SpotifyConnect = () => {

    const spotifyAuthUrl = new URL('https://accounts.spotify.com/authorize');
    spotifyAuthUrl.searchParams.append("client_id", '2d496310f6db494791df2b41b9c2342d');
    spotifyAuthUrl.searchParams.append("response_type", "code");
    spotifyAuthUrl.searchParams.append("scope", 'user-read-playback-state,user-read-currently-playing,streaming,user-read-playback-position,user-top-read,user-read-recently-played,user-library-read,user-read-private');
    spotifyAuthUrl.searchParams.append("redirect_uri", process.env.REACT_APP_ACTIVITRAX_SPOTIFY_REDIRECT_URI);

    return (
        <>
            <Paper elevation={0} sx={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', width: '350px', height: '50', m: 2, p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <img width={50} height={50} alt="Spotify Logo" src={SpotifyLogo} />
                </Box>
                <Typography variant="body2" sx={{ m: 3, fontSize: 16, fontWeight: 400, textAlign: 'center' }}>
                    A connection to your Spotify account is required to synchronize your Strava activities with your Spotify music.
                </Typography>
                <Button href={`${spotifyAuthUrl}`} variant="contained" sx={{ width: '100%', whiteSpace: 'nowrap' }}>Connect Spotify</Button>
            </Paper>
        </>
    )
}

const LatestStravaActivity = () => {

    return (
        <>
            <Container>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>Latest Strava Activity</Typography>
                <Card sx={{ m: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                    <Typography sx={{ m: 3, width: '100%' }} variant="body2">Name / Date / Time / Type / # Songs / Distance</Typography>
                </Card>
            </Container>
        </>
    )
}