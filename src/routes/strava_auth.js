import { useAuth0 } from "@auth0/auth0-react";
import { Box, CircularProgress } from "@mui/material";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import AppHeader from "../components/AppHeader";
import { exchangeStravaAuthToken } from "../services/strava";
import { strava_scopes } from "../services/strava";

export const StravaAuthPage = () => {

    const navigate = useNavigate();

    const { getAccessTokenSilently } = useAuth0();


    const { search } = useLocation();
    const searchParams = new URLSearchParams(search);
    const auth_code = searchParams.get('code');
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
                await exchangeStravaAuthToken(api_token, auth_code);

            }
            catch (e) {
                console.log(e)
            }

            navigate('/dashboard');

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