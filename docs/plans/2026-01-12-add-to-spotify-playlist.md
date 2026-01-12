# Add to Spotify Playlist Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Allow users to add tracks from their activity tracklists to any of their Spotify playlists via an anchored popup with search.

**Architecture:**
- Store OAuth scopes in MongoDB (`spotify_oauth_allows`, `strava_oauth_allows`) to track granted permissions
- Add new Spotify API endpoints for fetching playlists and adding tracks
- Frontend popup component anchored to button with search/filter and scrollable list
- Graceful re-auth flow when user lacks playlist permissions

**Tech Stack:** React, Material-UI, Express, MongoDB, Spotify Web API

---

## Part 1: OAuth Scope Storage (Backend)

### Task 1: Update Spotify token exchange to store scopes

**Files:**
- Modify: `activitrax-api/src/spotify/spotify.service.js`
- Modify: `activitrax-api/src/spotify/spotify.router.js`

**Step 1: Update spotify.service.js to accept and store scopes**

In `spotify.service.js`, modify `exchangeAuthToken` to accept scopes parameter and store them:

```javascript
const exchangeAuthToken = async (auth0_uid, auth_token, scopes) => {
    // exchange spotify authorization token for an access + refresh token
    const reqConfig = {
        method: "POST",
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic " + (Buffer.from(spotifyClientId + ":" + process.env.SPOTIFY_CLIENT_SECRET).toString("base64"))
        },
        params: {
            code: auth_token,
            grant_type: "authorization_code",
            redirect_uri: process.env.SPOTIFY_REDIRECT_URI
        }
    }

    // exchange auth_token for access + refresh tokens
    const spotifyResponse = await axios(reqConfig)

    // Parse response
    const connectionData = {
        access_token: _.get(spotifyResponse, 'data.access_token'),
        refresh_token: _.get(spotifyResponse, 'data.refresh_token')
    }

    // fetch spotify user profile with tokens
    const userProfile = await spotifyApi.getUser(auth0_uid, connectionData);

    const userUpdate = {
        spotify_access_token: _.get(spotifyResponse, 'data.access_token'),
        spotify_refresh_token: _.get(spotifyResponse, 'data.refresh_token'),
        spotify_uid: _.get(userProfile, 'id'),
        spotify_oauth_allows: scopes ? scopes.split(' ') : []
    }

    // save spotify user profile to mongodb
    await mongoUserDb.saveUser("auth0", auth0_uid, userUpdate);
}
```

**Step 2: Update spotify.router.js to pass scopes from request**

In `spotify.router.js`, update the `/exchange_token` endpoint:

```javascript
spotifyRouter.post("/exchange_token", validateAccessToken, async (req, res) => {
    try {
        const auth_token = req.body.auth_token;
        const scopes = req.body.scopes; // Add this line
        const user_id = req.auth.payload.sub;
        await spotifyService.exchangeAuthToken(user_id, auth_token, scopes); // Pass scopes
        // Clear any disconnection warning now that user has reconnected
        await auth0Service.clearDisconnectedService(user_id, 'spotify');
        res.status(200).json({ message: 'success' });
    } catch (error) {
        const error_message = _.get(error, 'response.data');
        console.log(JSON.stringify(error_message) || error);
        res.status(500).json({ message: 'server error' });
    }
});
```

**Step 3: Commit**

```bash
git add src/spotify/spotify.service.js src/spotify/spotify.router.js
git commit -m "feat(api): store spotify oauth scopes in user document

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 2: Update Strava token exchange to store scopes

**Files:**
- Modify: `activitrax-api/src/strava/strava.api.js`
- Modify: `activitrax-api/src/strava/strava.router.js`

**Step 1: Update strava.api.js exchangeAuthToken to accept and store scopes**

In `strava.api.js`, modify `exchangeAuthToken`:

```javascript
const exchangeAuthToken = async (uid, auth_token, scopes) => {
    // fetch strava user access_token / refresh_token
    const reqConfig = {
        method: "POST",
        url: "https://www.strava.com/oauth/token",
        params: {
            client_id: stravaClientId,
            client_secret: process.env.STRAVA_CLIENT_SECRET,
            code: auth_token,
            grant_type: "authorization_code"
        }
    }

    // exchange token
    const stravaResponse = await axios(reqConfig)

    // Parse response
    const userUpdate = {
        strava_access_token: stravaResponse.data.access_token,
        strava_refresh_token: stravaResponse.data.refresh_token,
        strava_uid: _.toString(stravaResponse.data.athlete.id),
        strava_oauth_allows: scopes ? scopes.split(',') : []
    }

    // update user data in mongo
    await mongoUserDb.saveUser("auth0", uid, userUpdate)
}
```

**Step 2: Update strava.router.js to pass scopes**

In `strava.router.js`, update the `/exchange_token` endpoint:

```javascript
stravaRouter.post("/exchange_token", validateAccessToken, async (req, res) => {
    try {
        const auth_token = req.body.auth_token;
        const scopes = req.body.scopes; // Add this line
        const user_id = req.auth.payload.sub;
        await stravaApi.exchangeAuthToken(user_id, auth_token, scopes); // Pass scopes
        // Clear any disconnection warning now that user has reconnected
        await auth0Service.clearDisconnectedService(user_id, 'strava');
        res.status(200).json({ message: 'success' });
    } catch (error) {
        const error_message = _.get(error, 'response.data');
        console.log(JSON.stringify(error_message) || error);
        res.status(500).json({ message: 'server error' });
    }
});
```

**Step 3: Commit**

```bash
git add src/strava/strava.api.js src/strava/strava.router.js
git commit -m "feat(api): store strava oauth scopes in user document

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 3: Expose oauth_allows in user config endpoint

**Files:**
- Modify: `activitrax-api/src/auth0/auth0.service.js`

**Step 1: Add oauth_allows fields to getUserConfigForClient**

```javascript
const getUserConfigForClient = async (auth0_uid) => {
    const userProfile = await mongoUserDb.getUser("auth0", auth0_uid);
    const userConfig = {};

    // Check if tokens exist
    userConfig.strava = !!_.get(userProfile, "strava_access_token");
    userConfig.spotify = !!_.get(userProfile, "spotify_access_token");

    // OAuth scopes granted
    userConfig.spotify_oauth_allows = _.get(userProfile, "spotify_oauth_allows", []);
    userConfig.strava_oauth_allows = _.get(userProfile, "strava_oauth_allows", []);

    // Return persisted disconnected services from database
    userConfig.disconnected_services = _.get(userProfile, 'disconnected_services', []);

    // User preferences (default to true if not set)
    userConfig.strava_description_enabled = _.get(userProfile, "strava_description_enabled", true);

    return userConfig;
}
```

**Step 2: Commit**

```bash
git add src/auth0/auth0.service.js
git commit -m "feat(api): expose oauth scopes in user config endpoint

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Part 2: Frontend OAuth Scope Handling

### Task 4: Update Spotify auth callback to pass scopes to backend

**Files:**
- Modify: `activitrax-ui/src/routes/spotify_auth.js`
- Modify: `activitrax-ui/src/services/spotify.js`

**Step 1: Update spotify.js service to accept scopes parameter**

```javascript
export const exchangeSpotifyAuthToken = async (api_token, auth_token, scopes) => {

    // Exchange spotify auth token for access token
    const reqConfig = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + api_token
        },
        url: process.env.REACT_APP_ACTIVITRAX_API_URL + "/spotify/exchange_token",
        data: {
            auth_token: auth_token,
            scopes: scopes
        }
    }

    const response = await axios(reqConfig);
    return response.data
}
```

**Step 2: Update spotify_auth.js to extract and pass scopes**

Spotify returns scopes in the URL hash or as a query parameter. Update `SpotifyAuthPage`:

```javascript
import { useAuth0 } from "@auth0/auth0-react";
import { Box, CircularProgress } from "@mui/material";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import AppHeader from "../components/AppHeader";
import { exchangeSpotifyAuthToken, spotify_scopes } from "../services/spotify";

export const SpotifyAuthPage = () => {

    const navigate = useNavigate();

    const { getAccessTokenSilently } = useAuth0();


    const { search } = useLocation();
    const searchParams = new URLSearchParams(search);
    const auth_code = searchParams.get('code');
    const error = searchParams.get('error');

    useEffect(() => {

        const exchangeAuthToken = async (auth_code) => {

            let success = false;

            try {

                if (error) {
                    if (error === 'access_denied') {
                        throw new Error(`user denied access to spotify`)
                    }
                }

                if (!auth_code) {
                    throw new Error(`no auth code returned from spotify`)
                }

                // exchange auth code for access token and register spotify account with user
                const api_token = await getAccessTokenSilently();
                // Pass the scopes we requested (Spotify doesn't return granted scopes in callback)
                await exchangeSpotifyAuthToken(api_token, auth_code, spotify_scopes);
                success = true;
            }
            catch (e) {
                console.log(e)
            }

            if (success) {
                navigate('/dashboard?spotify_connected=true');
            } else {
                navigate('/dashboard');
            }
        }

        exchangeAuthToken(auth_code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth_code])

    return (
        <div className="page-layout">
            <AppHeader />
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress color="secondary" sx={{ margin: 20 }} />
            </Box>
        </div >
    );
};
```

**Step 3: Commit**

```bash
git add src/routes/spotify_auth.js src/services/spotify.js
git commit -m "feat(ui): pass spotify oauth scopes to backend on token exchange

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 5: Update Strava auth callback to pass scopes to backend

**Files:**
- Modify: `activitrax-ui/src/routes/strava_auth.js`
- Modify: `activitrax-ui/src/services/strava.js`

**Step 1: Update strava.js service to accept scopes parameter**

```javascript
export const exchangeStravaAuthToken = async (api_token, auth_token, scopes) => {
    // Exchange strava auth token for access token
    const reqConfig = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + api_token
        },
        url: process.env.REACT_APP_ACTIVITRAX_API_URL + "/strava/exchange_token",
        data: {
            auth_token: auth_token,
            scopes: scopes
        }
    }

    const response = await axios(reqConfig);
    return response.data
}
```

**Step 2: Update strava_auth.js to pass validated scopes**

```javascript
useEffect(() => {

    const exchangeAuthToken = async (auth_code) => {

        let success = false;

        try {

            if (error) {
                if (error === 'access_denied') {
                    throw new Error(`user denied access to strava`)
                }
            }

            // make sure the user accepted all the scopes we need
            const scope_array = scope.split(',');
            const expected_scope_array = strava_scopes.split(',');
            for (let i = 0; i < expected_scope_array.length; i++) {
                if (!scope_array.includes(expected_scope_array[i])) {
                    throw new Error(`strava scopes required were not accepted by user`)
                }
            }

            // exchange auth code for access token and register strava account with user
            const api_token = await getAccessTokenSilently();
            await exchangeStravaAuthToken(api_token, auth_code, scope); // Pass the granted scopes
            success = true;

        }
        catch (e) {
            console.log(e)
        }

        // Only pass strava_connected param if exchange succeeded
        if (success) {
            navigate('/dashboard?strava_connected=true');
        } else {
            navigate('/dashboard');
        }

    }

    exchangeAuthToken(auth_code);

    // eslint-disable-next-line react-hooks/exhaustive-deps
}, [auth_code])
```

**Step 3: Commit**

```bash
git add src/routes/strava_auth.js src/services/strava.js
git commit -m "feat(ui): pass strava oauth scopes to backend on token exchange

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Part 3: Spotify Playlist API Endpoints

### Task 6: Add Spotify playlist API functions

**Files:**
- Modify: `activitrax-api/src/spotify/spotify.api.js`

**Step 1: Add getUserPlaylists function**

Add after the existing functions:

```javascript
const getUserPlaylists = async (uid, tokens) => {
    if (!tokens) {
        tokens = await mongoUserDb.getUserTokensByService("spotify", uid)
    }

    const reqConfig = {
        method: "GET",
        url: "https://api.spotify.com/v1/me/playlists",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + tokens.access_token
        },
        params: {
            limit: 50
        }
    }

    const response = await sendApiRequest(uid, reqConfig, tokens)

    // Return simplified playlist objects
    const playlists = _.get(response, 'data.items', []).map(playlist => ({
        id: playlist.id,
        name: playlist.name,
        image: playlist.images?.[0]?.url || null,
        tracks_count: playlist.tracks?.total || 0,
        owner: playlist.owner?.display_name || 'Unknown'
    }));

    return playlists;
}

const addTrackToPlaylist = async (uid, tokens, playlistId, trackUri) => {
    if (!tokens) {
        tokens = await mongoUserDb.getUserTokensByService("spotify", uid)
    }

    const reqConfig = {
        method: "POST",
        url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + tokens.access_token
        },
        data: {
            uris: [trackUri]
        }
    }

    const response = await sendApiRequest(uid, reqConfig, tokens)
    return response.data;
}
```

**Step 2: Export the new functions**

Update the module.exports:

```javascript
module.exports = {
    sendApiRequest,
    getUser,
    getTracklist,
    exchangeRefreshToken,
    getUserPlaylists,
    addTrackToPlaylist,
};
```

**Step 3: Commit**

```bash
git add src/spotify/spotify.api.js
git commit -m "feat(api): add spotify playlist fetch and add track functions

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 7: Add Spotify playlist router endpoints

**Files:**
- Modify: `activitrax-api/src/spotify/spotify.router.js`

**Step 1: Add GET /playlists endpoint**

```javascript
spotifyRouter.get('/playlists', validateAccessToken, async (req, res) => {
    try {
        const user_id = req.auth.payload.sub;
        const userProfile = await mongoUserDb.getUser("auth0", user_id);

        // Check if user has playlist permissions
        const allowedScopes = userProfile.spotify_oauth_allows || [];
        if (!allowedScopes.includes('playlist-modify-private')) {
            return res.status(403).json({
                message: 'insufficient_scope',
                required_scope: 'playlist-modify-private'
            });
        }

        const playlists = await spotifyApi.getUserPlaylists(userProfile.spotify_uid, {
            access_token: userProfile.spotify_access_token,
            refresh_token: userProfile.spotify_refresh_token
        });
        res.status(200).json(playlists);
    } catch (error) {
        const error_message = _.get(error, 'response.data');
        console.log(JSON.stringify(error_message) || error);
        res.status(500).json({ message: 'server error' });
    }
});
```

**Step 2: Add POST /playlists/:playlistId/tracks endpoint**

```javascript
spotifyRouter.post('/playlists/:playlistId/tracks', validateAccessToken, async (req, res) => {
    try {
        const user_id = req.auth.payload.sub;
        const playlistId = req.params.playlistId;
        const trackUri = req.body.track_uri;

        if (!trackUri) {
            return res.status(400).json({ message: 'track_uri is required' });
        }

        const userProfile = await mongoUserDb.getUser("auth0", user_id);

        // Check if user has playlist permissions
        const allowedScopes = userProfile.spotify_oauth_allows || [];
        if (!allowedScopes.includes('playlist-modify-private')) {
            return res.status(403).json({
                message: 'insufficient_scope',
                required_scope: 'playlist-modify-private'
            });
        }

        await spotifyApi.addTrackToPlaylist(userProfile.spotify_uid, {
            access_token: userProfile.spotify_access_token,
            refresh_token: userProfile.spotify_refresh_token
        }, playlistId, trackUri);

        res.status(200).json({ message: 'success' });
    } catch (error) {
        const error_message = _.get(error, 'response.data');
        console.log(JSON.stringify(error_message) || error);
        res.status(500).json({ message: 'server error' });
    }
});
```

**Step 3: Commit**

```bash
git add src/spotify/spotify.router.js
git commit -m "feat(api): add endpoints for fetching playlists and adding tracks

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Part 4: Frontend Playlist Feature

### Task 8: Add frontend Spotify playlist service functions

**Files:**
- Modify: `activitrax-ui/src/services/spotify.js`

**Step 1: Add playlist service functions and update scopes**

```javascript
import axios from "axios";

export const exchangeSpotifyAuthToken = async (api_token, auth_token, scopes) => {

    // Exchange spotify auth token for access token
    const reqConfig = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + api_token
        },
        url: process.env.REACT_APP_ACTIVITRAX_API_URL + "/spotify/exchange_token",
        data: {
            auth_token: auth_token,
            scopes: scopes
        }
    }

    const response = await axios(reqConfig);
    return response.data
}

export const getSpotifyPlaylists = async (api_token) => {
    const reqConfig = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + api_token
        },
        url: process.env.REACT_APP_ACTIVITRAX_API_URL + "/spotify/playlists"
    }

    const response = await axios(reqConfig);
    return response.data
}

export const addTrackToPlaylist = async (api_token, playlistId, trackUri) => {
    const reqConfig = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + api_token
        },
        url: process.env.REACT_APP_ACTIVITRAX_API_URL + `/spotify/playlists/${playlistId}/tracks`,
        data: {
            track_uri: trackUri
        }
    }

    const response = await axios(reqConfig);
    return response.data
}

// Base scopes (existing functionality)
export const spotify_scopes_base = 'user-read-recently-played user-read-email user-read-private'

// Full scopes including playlist modification
export const spotify_scopes_with_playlists = 'user-read-recently-played user-read-email user-read-private playlist-modify-public playlist-modify-private'

// Default scopes to request (now includes playlist permissions)
export const spotify_scopes = spotify_scopes_with_playlists
```

**Step 2: Commit**

```bash
git add src/services/spotify.js
git commit -m "feat(ui): add spotify playlist service functions and extended scopes

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 9: Create AddToPlaylistButton component

**Files:**
- Create: `activitrax-ui/src/components/AddToPlaylistButton.js`

**Step 1: Create the component**

```javascript
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
```

**Step 2: Commit**

```bash
git add src/components/AddToPlaylistButton.js
git commit -m "feat(ui): create AddToPlaylistButton component with popover

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 10: Integrate AddToPlaylistButton into TrackItem

**Files:**
- Modify: `activitrax-ui/src/routes/dashboard.js`

**Step 1: Import the component at the top of the file**

Add after the existing imports:

```javascript
import AddToPlaylistButton from "../components/AddToPlaylistButton";
```

**Step 2: Update TrackItem component to include AddToPlaylistButton**

Find the `TrackItem` component and update the `secondaryAction`:

```javascript
const TrackItem = ({ track, isPlaying, onPlayToggle, spotifyOAuthAllows }) => {
    const hasPreview = !!track.preview_url;

    return (
        <ListItem
            sx={{ py: 1, px: 2 }}
            secondaryAction={
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {track.spotify_url && (
                        <AddToPlaylistButton
                            track={track}
                            spotifyOAuthAllows={spotifyOAuthAllows}
                        />
                    )}
                    {track.spotify_url && (
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
                    )}
                </Box>
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
```

**Step 3: Update ActivityRow to pass spotifyOAuthAllows to TrackItem**

Find where `TrackItem` is rendered in `ActivityRow` and pass the prop. This requires getting `spotifyOAuthAllows` from the parent component.

Update the `ActivityRow` component signature:

```javascript
const ActivityRow = ({ activity, onExpandClick, isExpanded, tracklist, isLoading, spotifyOAuthAllows }) => {
```

And where TrackItem is mapped:

```javascript
{tracklist.map((track, index) => (
    <TrackItem
        key={index}
        track={track}
        isPlaying={isTrackPlaying(track)}
        onPlayToggle={() => handlePlayToggle(track)}
        spotifyOAuthAllows={spotifyOAuthAllows}
    />
))}
```

**Step 4: Update ActivitiesTable to pass spotifyOAuthAllows**

Find the `ActivitiesTable` component and update it to accept and pass `spotifyOAuthAllows`:

```javascript
const ActivitiesTable = ({ activities, spotifyOAuthAllows }) => {
```

And where `ActivityRow` is rendered:

```javascript
<ActivityRow
    key={activity.id}
    activity={activity}
    onExpandClick={() => handleExpandClick(activity.id)}
    isExpanded={expandedRow === activity.id}
    tracklist={tracklists[activity.id] || []}
    isLoading={loadingTracklists[activity.id] || false}
    spotifyOAuthAllows={spotifyOAuthAllows}
/>
```

**Step 5: Update ServiceConnectDialogue to fetch and pass spotifyOAuthAllows**

In the `ServiceConnectDialogue` component, add state for oauth allows and pass it down:

Add state:
```javascript
const [spotifyOAuthAllows, setSpotifyOAuthAllows] = useState([]);
```

In the `fetchUserConfig` function, extract the oauth allows:
```javascript
const fetchUserConfig = async () => {
    try {
        const api_token = await getAccessTokenSilently();
        const config = await getUserConfig(api_token);
        setStravaConnected(config.strava);
        setSpotifyConnected(config.spotify);
        setDisconnectedServices(config.disconnected_services || []);
        setSpotifyOAuthAllows(config.spotify_oauth_allows || []); // Add this line
        // ... rest of the function
    } catch (error) {
        console.log(error);
    }
};
```

And pass it to `ActivitiesTable`:
```javascript
<ActivitiesTable
    activities={activities}
    spotifyOAuthAllows={spotifyOAuthAllows}
/>
```

**Step 6: Commit**

```bash
git add src/routes/dashboard.js
git commit -m "feat(ui): integrate AddToPlaylistButton into track list

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Part 5: Testing

### Task 11: Manual testing checklist

**Test scenarios:**

1. **New user connects Spotify:**
   - Connect Spotify with new scopes
   - Verify `spotify_oauth_allows` is saved in MongoDB
   - Verify user config endpoint returns the scopes

2. **Existing user without playlist permissions:**
   - Click "Add to Playlist" button
   - Verify reauth prompt appears
   - Click "Connect Spotify"
   - Complete OAuth flow
   - Verify new scopes are saved

3. **User with playlist permissions:**
   - Click "Add to Playlist" button
   - Verify playlist popup appears
   - Test search/filter
   - Add track to playlist
   - Verify success checkmark appears

4. **Strava scope storage:**
   - Connect Strava
   - Verify `strava_oauth_allows` is saved in MongoDB
   - Verify user config endpoint returns the scopes

---

## Summary

This plan implements:
1. OAuth scope storage for both Spotify and Strava (`*_oauth_allows` fields)
2. Backend API endpoints for fetching user playlists and adding tracks
3. Frontend `AddToPlaylistButton` component with anchored popover
4. Search/filter functionality for playlists
5. Graceful re-auth flow for users missing playlist permissions
6. Extended Spotify scopes to include `playlist-modify-public` and `playlist-modify-private`
