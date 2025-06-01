import { useAuth0 } from "@auth0/auth0-react";
import { Box, Button, Card, CardContent, CardMedia, CircularProgress, Container, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import AppHeader from "../components/AppHeader";
import SpotifyLogo from '../images/spotify-2.svg';
import StravaLogo from '../images/strava-2.svg';

import { strava_scopes, useGetStravaAuthToken } from "../services/strava";
import { useNavigate } from "react-router";
import { getUserConfig } from "../services/auth0";
import { spotify_scopes } from "../services/spotify";

export default function Dashboard(props) {

    return (
        <>
            <AppHeader />
            <ServiceConnectDialogue />
        </>
    )
}

const ServiceConnectDialogue = () => {


    const { getAccessTokenSilently, isAuthenticated, user } = useAuth0();

    const [accessToken, setAccessToken] = useState(null);
    const [stravaConnected, setStravaConnected] = useState(false);
    const [spotifyConnected, setSpotifyConnected] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [latestStravaActivity, setLatestStravaActivity] = useState(null);
    const [userConfig, setUserConfig] = useState(null);


    // import useTheme hook so we can apply some breakpoints in our styles
    const theme = useTheme();

    // create a styles object where each key acts similar to a class name
    // apply the styling to components by passing the desired key to the component's sx prop
    const styles = {
        container: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            [theme.breakpoints.down('md')]: {   // apply styles when screen width is less than 960px
                flexDirection: 'column',
            }
        }
    }

    useEffect(() => {

        const fetchData = async () => {
            try {

                // get api access token
                const accessToken = await getAccessTokenSilently();
                setAccessToken(accessToken);

                // get user config
                const userConfig = await getUserConfig(accessToken);
                setUserConfig(userConfig);

                // if user has strava connection
                if (userConfig.strava) {
                    setStravaConnected(true);
                }

                // if user has spotify connection
                if (userConfig.spotify) {
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
                        <LatestStravaActivity latestActivity={userConfig.last_strava_activity} />
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
    stravaAuthUrl.searchParams.append("redirect_uri", process.env.STRAVA_REDIRECT_URI);

    return (
        <>
            <Paper elevation={1} sx={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', m: 2, p: 2 }}>
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
    spotifyAuthUrl.searchParams.append("show_dialog", "true");
    spotifyAuthUrl.searchParams.append("scope", spotify_scopes);
    spotifyAuthUrl.searchParams.append("redirect_uri", process.env.SPOTIFY_REDIRECT_URI);

    return (
        <>
            <Paper elevation={1} sx={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', m: 2, p: 2 }}>
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

const LatestStravaActivity = (props) => {

    const { latestActivity } = props;

    const theme = useTheme();

    useEffect(() => {

    }, [latestActivity])

    return (
        <>
            <Typography variant="h6" sx={{ m: 3, fontWeight: 800 }}>Latest Strava Activity</Typography>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    {/* Add background to table head */}
                    <TableHead sx={{ backgroundColor: theme.palette.primary.light }}>
                        <TableRow>
                            <TableCell align="center">Activity Title</TableCell>
                            <TableCell align="center">Date</TableCell>
                            <TableCell align="center">Start Time</TableCell>
                            <TableCell align="center">Type</TableCell>
                            <TableCell align="center">Distance</TableCell>
                            <TableCell align="center">Track Count</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {latestActivity && (
                            <TableRow>
                                <TableCell component="th" scope="row" align="center">{latestActivity?.name || ""}</TableCell>
                                <TableCell component="th" scope="row" align="center">{latestActivity?.start_date_formatted || ""}</TableCell>
                                <TableCell component="th" scope="row" align="center">{latestActivity?.start_time_formatted || ""}</TableCell>
                                <TableCell component="th" scope="row" align="center">{latestActivity?.type || ""}</TableCell>
                                <TableCell component="th" scope="row" align="center">{latestActivity?.distance_miles + " miles" || ""}</TableCell>
                                <TableCell component="th" scope="row" align="center">{latestActivity?.track_count || "0"}</TableCell>
                            </TableRow>
                        )}
                        {!latestActivity && (
                            <TableRow>
                                <TableCell component="th" scope="row" align="center">{"N/A"}</TableCell>
                                <TableCell component="th" scope="row" align="center">{"N/A"}</TableCell>
                                <TableCell component="th" scope="row" align="center">{"N/A"}</TableCell>
                                <TableCell component="th" scope="row" align="center">{"N/A"}</TableCell>
                                <TableCell component="th" scope="row" align="center">{"N/A"}</TableCell>
                                <TableCell component="th" scope="row" align="center">{"N/A"}</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}