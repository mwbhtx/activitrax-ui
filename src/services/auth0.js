import axios from 'axios'

export const getUserConfig = async (api_token) => {
    const reqConfig = {
        method: "GET",
        url: process.env.REACT_APP_ACTIVITRAX_API_URL + "/user/config",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + api_token
        }
    }
    const response = await axios(reqConfig);
    return response.data
}

export const updateUserConfig = async (api_token, updates) => {
    const reqConfig = {
        method: "PATCH",
        url: process.env.REACT_APP_ACTIVITRAX_API_URL + "/user/config",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + api_token
        },
        data: updates
    }
    const response = await axios(reqConfig);
    return response.data
}

export const disconnectService = async (api_token, service_name) => {
    const reqConfig = {
        method: "POST",
        url: process.env.REACT_APP_ACTIVITRAX_API_URL + "/user/disconnect",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + api_token
        },
        data: {
            service_name: service_name
        }
    }

    const response = await axios(reqConfig);
    return response.data
}

export const getUserActivities = async (api_token) => {
    const reqConfig = {
        method: "GET",
        url: process.env.REACT_APP_ACTIVITRAX_API_URL + "/user/activities",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + api_token
        }
    }
    const response = await axios(reqConfig);
    return response.data
}

export const getActivityTracklist = async (api_token, activity_id) => {
    const reqConfig = {
        method: "GET",
        url: process.env.REACT_APP_ACTIVITRAX_API_URL + "/user/tracklist/" + activity_id,
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + api_token
        }
    }
    const response = await axios(reqConfig);
    return response.data
}

export const validateConnections = async (api_token) => {
    const reqConfig = {
        method: "POST",
        url: process.env.REACT_APP_ACTIVITRAX_API_URL + "/user/validate-connections",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + api_token
        }
    }
    const response = await axios(reqConfig);
    return response.data
}
