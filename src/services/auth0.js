import axios from 'axios'
 
export const getUserConfig = async (api_token) => {
    const reqConfig = {
        method: "GET",
        url: process.env.REACT_APP_ACTIVITRAX_API_URL + "/app/user_config",
        headers: {
            "Content-Type": "application/json",
            "authorization": "Bearer " + api_token
        }
    }
    const response = await axios(reqConfig);
    return response.data
}

export const disconnectService = async (api_token, service_name) => {
    const reqConfig = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + api_token
        },
        url: process.env.REACT_APP_ACTIVITRAX_API_URL + "/app/disconnect_service",
        data: {
            service_name: service_name
        }
    }

    const response = await axios(reqConfig);
    return response.data
}