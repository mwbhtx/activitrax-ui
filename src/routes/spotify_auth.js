import { useAuth0 } from "@auth0/auth0-react";
import { Box, CircularProgress } from "@mui/material";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import AppHeader from "../components/AppHeader";
import { exchangeSpotifyAuthToken } from "../services/spotify";

export const SpotifyAuthPage = () => {

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
                await exchangeSpotifyAuthToken(api_token, auth_code);
            }
            catch (e) {
                console.log(e)
            }

            navigate('/dashboard');
        }

        exchangeAuthToken(auth_code);

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