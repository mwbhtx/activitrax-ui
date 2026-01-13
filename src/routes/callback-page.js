import { Box, CircularProgress } from "@mui/material";
import React from "react";
import PageLayout from "../components/PageLayout";

export const CallbackPage = () => {
    return (
        <PageLayout>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress color="secondary" sx={{ margin: 20 }} />
            </Box>
        </PageLayout>
    );
};