import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import { Link as RouterLink } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import SyncIcon from '@mui/icons-material/Sync';
import DescriptionIcon from '@mui/icons-material/Description';
import StravaLogo from '../images/strava_logo_icon_147232.svg';
import SpotifyLogo from '../images/spotify-2.svg';

export default function About() {
    const { isAuthenticated } = useAuth0();

    return (
        <>
            <AppHeader />
            <Box
                sx={{
                    minHeight: 'calc(100vh - 64px)',
                    backgroundColor: 'background.default',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Ambient glow */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: '10%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '600px',
                        height: '400px',
                        background: 'radial-gradient(ellipse, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
                        filter: 'blur(60px)',
                        pointerEvents: 'none',
                    }}
                />

                <Container maxWidth="md" sx={{ py: 6, position: 'relative', zIndex: 1 }}>
                    {/* Hero Section */}
                    <Stack spacing={2} alignItems="center" textAlign="center" sx={{ mb: 8 }}>
                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 700,
                                background: 'linear-gradient(135deg, #ffffff 0%, #A78BFA 50%, #8B5CF6 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            About Activitrax
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{ color: '#ebd7ff', maxWidth: 500 }}
                        >
                            See what music powered every run, ride, and workout.
                        </Typography>
                    </Stack>

                    {/* What is Activitrax */}
                    <Stack spacing={3} sx={{ mb: 8 }}>
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 600,
                                color: 'primary.light',
                            }}
                        >
                            What is Activitrax?
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                            Activitrax connects your Strava workouts with your Spotify listening history.
                            Ever finished a great run and wondered what songs were playing during your
                            fastest mile? Or wanted to remember the playlist that got you through a tough
                            workout? Activitrax matches your activities with the exact tracks you were
                            listening to, so you can relive the soundtrack to every workout.
                        </Typography>
                    </Stack>

                    {/* How It Works */}
                    <Stack spacing={4} sx={{ mb: 8 }}>
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 600,
                                color: 'primary.light',
                            }}
                        >
                            How It Works
                        </Typography>

                        <Stack spacing={4}>
                            {/* Step 1 */}
                            <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: '50%',
                                        backgroundColor: 'rgba(139, 92, 246, 0.2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                    }}
                                >
                                    <img src={StravaLogo} alt="Strava" width={28} height={28} />
                                </Box>
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                                        1. Connect Strava
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                                        Link your Strava account to import your activities. We pull in your
                                        runs, rides, hikes, and other workouts along with their timestamps.
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Step 2 */}
                            <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: '50%',
                                        backgroundColor: 'rgba(139, 92, 246, 0.2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                    }}
                                >
                                    <img src={SpotifyLogo} alt="Spotify" width={28} height={28} />
                                </Box>
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                                        2. Connect Spotify
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                                        Link your Spotify account so we can access your recently played tracks.
                                        This lets us see what you were listening to and when.
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Step 3 */}
                            <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: '50%',
                                        backgroundColor: 'rgba(139, 92, 246, 0.2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                    }}
                                >
                                    <SyncIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                                </Box>
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                                        3. Automatic Matching
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                                        When you complete an activity, Activitrax automatically matches it with
                                        the songs you played during that time window. No manual work required.
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Step 4 */}
                            <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: '50%',
                                        backgroundColor: 'rgba(139, 92, 246, 0.2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                    }}
                                >
                                    <MusicNoteIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                                </Box>
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                                        4. View Your Soundtracks
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                                        Browse your activities and see the complete tracklist for each one.
                                        Preview tracks, see album art, and rediscover the music that fueled
                                        your best workouts.
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Step 5 */}
                            <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: '50%',
                                        backgroundColor: 'rgba(139, 92, 246, 0.2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                    }}
                                >
                                    <DescriptionIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                                </Box>
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                                        5. Save to Strava (Optional)
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                                        Want to share your workout soundtrack? Enable the option to automatically
                                        add your tracklist to your Strava activity description. Your followers
                                        can see exactly what music powered your workout.
                                    </Typography>
                                </Box>
                            </Box>
                        </Stack>
                    </Stack>

                    {/* CTA for unauthenticated users */}
                    {!isAuthenticated && (
                        <Stack spacing={2} alignItems="center" sx={{ mt: 6 }}>
                            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                Ready to see your workout soundtracks?
                            </Typography>
                            <Button
                                component={RouterLink}
                                to="/"
                                variant="contained"
                                size="large"
                                sx={{ px: 4, py: 1.25, fontWeight: 600 }}
                            >
                                Get Started
                            </Button>
                        </Stack>
                    )}
                </Container>
            </Box>
        </>
    );
}
