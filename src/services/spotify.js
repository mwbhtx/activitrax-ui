import axios from "axios";

export const exchangeSpotifyAuthToken = async (api_token, auth_token) => {
    
    // Exchange spotify auth token for access token
    const reqConfig = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + api_token
        },
        url: process.env.ACTIVITRAX_API_URL + "/spotify/exchange_token",
        data: {
            auth_token: auth_token,
        }
    }

    const response = await axios(reqConfig);
    return response.data
}

export const spotify_scopes = 'user-read-recently-played user-read-email user-read-private'