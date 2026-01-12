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
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    if (isMobile) {
        return <MobileHome />;
    }

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

const MobileHome = () => {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundColor: '#0F0B1A',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Ambient glow top */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '-20%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '500px',
                    height: '500px',
                    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, rgba(139, 92, 246, 0.1) 40%, transparent 70%)',
                    filter: 'blur(80px)',
                    pointerEvents: 'none',
                }}
            />

            {/* Content */}
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    px: 4,
                    py: 4,
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                {/* Logo with gradient using mask */}
                <Box
                    sx={{
                        width: '90%',
                        maxWidth: 320,
                        height: 200,
                        mb: 3,
                        background: 'linear-gradient(135deg, #ffffff 0%, #A78BFA 50%, #8B5CF6 100%)',
                        WebkitMask: `url(${ActivitraxLogo}) center/contain no-repeat`,
                        mask: `url(${ActivitraxLogo}) center/contain no-repeat`,
                    }}
                />

                {/* Headline */}
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        textAlign: 'center',
                        mb: 2,
                        background: 'linear-gradient(135deg, #ffffff 0%, #A78BFA 50%, #8B5CF6 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        letterSpacing: '-0.02em',
                    }}
                >
                    Your Music. Your Workouts.
                </Typography>

                {/* Tagline */}
                <Typography
                    variant="body1"
                    sx={{
                        color: '#ebd7ff',
                        textAlign: 'center',
                        mb: 6,
                        maxWidth: 320,
                        lineHeight: 1.6,
                    }}
                >
                    Connect Strava and Spotify to see what music powered every run, ride, and workout.
                </Typography>

                {/* Buttons */}
                <Stack spacing={2} sx={{ width: '100%', maxWidth: 300 }}>
                    <SignupButton />
                    <LoginButton />
                </Stack>
            </Box>

            {/* Bottom ambient glow */}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: '-30%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '600px',
                    height: '400px',
                    background: 'radial-gradient(ellipse, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
                    filter: 'blur(60px)',
                    pointerEvents: 'none',
                }}
            />
        </Box>
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