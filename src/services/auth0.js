import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios'
 
export const getUserConfig = async (api_token) => {
    const reqConfig = {
        method: "GET",
        url: process.env.ACTIVITRAX_API_URL + "/auth0/user_config",
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
        url: process.env.ACTIVITRAX_API_URL + "/auth0/disconnect_service",
        data: {
            service_name: service_name
        }
    }

    const response = await axios(reqConfig);
    return response.data
}