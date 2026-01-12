import axios from "axios";

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
 
export const strava_scopes = "read,read_all,profile:read_all,profile:write,activity:read_all,activity:write"