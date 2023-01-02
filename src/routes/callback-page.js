import { Box, CircularProgress, Container, Typography } from "@mui/material";
import React from "react";
import AppHeader from "../components/AppHeader";

export const CallbackPage = () => {
    return (
        <div className="page-layout">
            <AppHeader />
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress color="secondary" sx={{ margin: 20 }} />
            </Box>
        </div >
    );
};