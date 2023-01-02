import { useAuth0 } from "@auth0/auth0-react";
import { Box, CircularProgress, Container, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import AppHeader from "../components/AppHeader";
import { exchangeStravaAuthToken } from "../services/strava";

export const StravaAuthPage = () => {

    const navigate = useNavigate();

    const { getAccessTokenSilently } = useAuth0();


    const { search } = useLocation();
    const searchParams = new URLSearchParams(search);
    const auth_code = searchParams.get('code');
    const state = searchParams.get('state');
    const scope = searchParams.get('scope');
    const error = searchParams.get('error');

    useEffect(() => {

        const exchangeAuthToken = async (auth_code) => {

            if (error) {
                navigate('/dashboard');
            }
            
            const api_token = await getAccessTokenSilently();
            const stravaData = await exchangeStravaAuthToken(api_token, auth_code);
            navigate('/dashboard');
        }

        exchangeAuthToken(auth_code);

    }, [auth_code])

    return (
        <div className="page-layout">
            <AppHeader />
            <Box sx={{ display: 'flex', justifyContent: 'center'}}>
                <CircularProgress color="secondary" sx={{ margin: 20 }} />
            </Box>
        </div >
    );
};