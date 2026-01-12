import axios from "axios";

/**
 * Like a track
 * @param {string} api_token - Auth0 access token
 * @param {Object} track - Track metadata object
 */
export const likeTrack = async (api_token, track) => {
    const reqConfig = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + api_token
        },
        url: process.env.REACT_APP_ACTIVITRAX_API_URL + "/user/liked-tracks",
        data: {
            track: {
                spotify_track_id: track.spotify_url?.split('/track/')[1]?.split('?')[0],
                spotify_uri: `spotify:track:${track.spotify_url?.split('/track/')[1]?.split('?')[0]}`,
                name: track.name,
                artist: track.artist,
                album: track.album,
                album_image: track.album_image,
                spotify_url: track.spotify_url,
                duration_ms: track.duration
            }
        }
    };

    const response = await axios(reqConfig);
    return response.data;
};

/**
 * Unlike a track
 * @param {string} api_token - Auth0 access token
 * @param {string} spotify_track_id - Spotify track ID
 */
export const unlikeTrack = async (api_token, spotify_track_id) => {
    const reqConfig = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + api_token
        },
        url: process.env.REACT_APP_ACTIVITRAX_API_URL + `/user/liked-tracks/${spotify_track_id}`
    };

    const response = await axios(reqConfig);
    return response.data;
};

/**
 * Get liked track IDs (for dashboard state)
 * @param {string} api_token - Auth0 access token
 * @returns {Promise<string[]>} Array of spotify_track_ids
 */
export const getLikedTrackIds = async (api_token) => {
    const reqConfig = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + api_token
        },
        url: process.env.REACT_APP_ACTIVITRAX_API_URL + "/user/liked-tracks/ids"
    };

    const response = await axios(reqConfig);
    return response.data.liked_track_ids;
};

/**
 * Get liked tracks with full metadata (for liked tracks page)
 * @param {string} api_token - Auth0 access token
 * @returns {Promise<Object[]>} Array of track objects with liked_at
 */
export const getLikedTracks = async (api_token) => {
    const reqConfig = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + api_token
        },
        url: process.env.REACT_APP_ACTIVITRAX_API_URL + "/user/liked-tracks"
    };

    const response = await axios(reqConfig);
    return response.data.tracks;
};

/**
 * Extract spotify_track_id from a track object
 * @param {Object} track - Track object with spotify_url
 * @returns {string|null} Spotify track ID
 */
export const getSpotifyTrackId = (track) => {
    if (!track?.spotify_url) return null;
    return track.spotify_url.split('/track/')[1]?.split('?')[0] || null;
};
