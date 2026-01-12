import { useAuth0 } from "@auth0/auth0-react";
import { Box, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Navigate } from "react-router";
import AppHeader from "../components/AppHeader";
import LoginButton from "../components/LoginButton";
import SignupButton from "../components/SignupButton";
import ActivitraxLogo from "../images/activitrax-logo.svg";
import RunningImage01 from "../images/pexels-cottonbro-5319375.jpg";


export default function Home() {

    const { isLoading, isAuthenticated } = useAuth0();

    if (isLoading) {
        return (
            null
        )
    }

    return (
        <>
            {isAuthenticated && <AppHeader />}
            {isAuthenticated ? <Navigate to="/dashboard" /> : <HomeComponent />}
        </>
    )
}

const HomeComponent = () => {
    return (
        <Grid2
            container
            sx={{
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundImage: `url(${RunningImage01})`,
                position: 'absolute',
                bottom: 0,
                right: 0,
                top: 0,
                left: 0,
                overflow: 'auto',
            }}
        >
            <Grid2 xs={12} display="flex" justifyContent="center" alignItems="center">
                <AuthDialog />
            </Grid2>
        </Grid2>
    );
};

function AuthDialog() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box
            sx={{
                width: { xs: '100%', sm: 360 },
                maxWidth: '100%',
                minHeight: { xs: '70vh', sm: 'auto' },
                p: { xs: 4, sm: 4 },
                m: { xs: 2, sm: 3 },
                backgroundColor: 'custom.glassBg',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderRadius: { xs: 2, sm: 3 },
                border: '1px solid',
                borderColor: 'custom.glassBorder',
                boxShadow: (theme) => `0 8px 32px ${theme.palette.custom.overlay}`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
            }}
        >
            <Stack spacing={{ xs: 6, sm: 6 }} direction="column">
                <Stack spacing={2}>
                    <Box
                        component="img"
                        src={ActivitraxLogo}
                        alt="Activitrax Logo"
                        sx={{
                            width: '100%',
                            height: isMobile ? 140 : 180,
                            objectFit: 'contain',
                        }}
                    />
                    <Typography
                        variant="body2"
                        sx={{
                            fontSize: { xs: 14, sm: 16 },
                            fontWeight: 400,
                            textAlign: 'center',
                            color: 'custom.overlayDark',
                            px: { xs: 1, sm: 0 },
                        }}
                    >
                        Discover the soundtrack to your runs, rides, and workouts. Connect Strava and Spotify to see what music powered every activity.
                    </Typography>
                </Stack>
                <Stack spacing={2}>
                    <SignupButton />
                    <LoginButton />
                </Stack>
            </Stack>
        </Box>
    );
}