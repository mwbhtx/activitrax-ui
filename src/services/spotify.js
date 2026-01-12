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
