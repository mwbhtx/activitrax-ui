import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { CircularProgress } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

export const Auth0ProviderWithHistory = ({ children }) => {
    const navigate = useNavigate();

    const domain = process.env.REACT_APP_ACTIVITRAX_AUTH0_DOMAIN;
    const clientId = process.env.REACT_APP_ACTIVITRAX_AUTH0_CLIENT_ID;
    const redirectUri = process.env.REACT_APP_ACTIVITRAX_AUTH0_REDIRECT_URI;
    const audience = process.env.REACT_APP_ACTIVITRAX_AUTH0_AUDIENCE;

    const onRedirectCallback = (appState) => {
        navigate(appState?.returnTo || window.location.pathname);
    };

    if (!(domain && clientId && audience)) {
        return null;
    }

    return (
        <Auth0Provider
            domain={domain}
            clientId={clientId}
            redirectUri={redirectUri}
            onRedirectCallback={onRedirectCallback}
            audience={audience}
            useRefreshTokens
            cacheLocation="localstorage"
        >
            {children}
        </Auth0Provider>
    );
};