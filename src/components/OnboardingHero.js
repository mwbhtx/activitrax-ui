import { Box, Button, Typography, Fade, Grow } from "@mui/material";
import { keyframes } from "@mui/system";
import StravaLogo from '../images/strava_logo_icon_147232.svg';
import SpotifyLogo from '../images/spotify-2.svg';
import ActivitraxLogo from '../images/activitrax-logo-white.svg';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Keyframe animations
const flowRight = keyframes`
    0% { transform: translateX(-10px); opacity: 0; }
    50% { opacity: 1; }
    100% { transform: translateX(10px); opacity: 0; }
`;

const flowLeft = keyframes`
    0% { transform: translateX(10px); opacity: 0; }
    50% { opacity: 1; }
    100% { transform: translateX(-10px); opacity: 0; }
`;

const glowPulse = keyframes`
    0%, 100% { box-shadow: 0 0 15px rgba(139, 92, 246, 0.3); }
    50% { box-shadow: 0 0 25px rgba(139, 92, 246, 0.5); }
`;

// Connection line with animated dots
const ConnectionLine = ({ direction = 'right', active = false }) => (
    <Box sx={{
        display: 'flex',
        alignItems: 'center',
        width: 60,
        justifyContent: 'center',
        position: 'relative',
    }}>
        <Box sx={{
            height: 2,
            width: '100%',
            backgroundColor: active ? 'primary.main' : 'custom.border',
            borderRadius: 1,
            transition: 'background-color 0.5s ease',
        }} />
        {active && (
            <Box sx={{
                position: 'absolute',
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: 'primary.light',
                animation: `${direction === 'right' ? flowRight : flowLeft} 1.5s ease-in-out infinite`,
            }} />
        )}
    </Box>
);

// Service logo with status indicator
const ServiceNode = ({ logo, alt, connected = false, active = false, size = 60 }) => (
    <Box sx={{ position: 'relative' }}>
        <Box sx={{
            width: size + 16,
            height: size + 16,
            borderRadius: '50%',
            backgroundColor: 'transparent',
            border: '2px solid',
            borderColor: connected ? 'success.main' : active ? 'primary.main' : 'custom.border',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            animation: active ? `${glowPulse} 2s ease-in-out infinite` : 'none',
            overflow: 'hidden',
        }}>
            <img
                width={size}
                height={size}
                alt={alt}
                src={logo}
                style={{
                    opacity: connected || active ? 1 : 0.5,
                    borderRadius: '50%',
                }}
            />
        </Box>
        {connected && (
            <Grow in={connected}>
                <Box sx={{
                    position: 'absolute',
                    bottom: -4,
                    right: -4,
                    backgroundColor: 'background.default',
                    borderRadius: '50%',
                    padding: '2px',
                }}>
                    <CheckCircleIcon sx={{ color: 'success.main', fontSize: 24 }} />
                </Box>
            </Grow>
        )}
    </Box>
);

// Main connection visual
const ConnectionVisual = ({ stravaConnected = false, spotifyConnected = false }) => (
    <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        my: 3,
    }}>
        <ServiceNode
            logo={StravaLogo}
            alt="Strava"
            connected={stravaConnected}
            active={!stravaConnected}
        />
        <ConnectionLine
            direction="right"
            active={stravaConnected}
        />
        <ServiceNode
            logo={ActivitraxLogo}
            alt="Activitrax"
            connected={stravaConnected && spotifyConnected}
            active={stravaConnected || spotifyConnected}
            size={50}
        />
        <ConnectionLine
            direction="left"
            active={spotifyConnected}
        />
        <ServiceNode
            logo={SpotifyLogo}
            alt="Spotify"
            connected={spotifyConnected}
            active={stravaConnected && !spotifyConnected}
        />
    </Box>
);

// Unified connection flow component
const ConnectionFlow = ({
    stravaConnected,
    spotifyConnected,
    stravaAuthUrl,
    spotifyAuthUrl
}) => {
    // Both connected - don't render
    if (stravaConnected && spotifyConnected) {
        return null;
    }

    // Determine what to show
    const needsStrava = !stravaConnected;
    const needsSpotify = stravaConnected && !spotifyConnected;

    return (
        <Fade in timeout={600}>
            <Box sx={{
                textAlign: 'center',
                py: 5,
                px: 4,
                mt: 4,
                mb: 0,
                position: 'relative',
                overflow: 'visible',
                // Divider line at bottom
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: '15%',
                    right: '15%',
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.3), transparent)',
                    pointerEvents: 'none',
                },
            }}>
                {/* Blurred ambient blob */}
                <Box sx={{
                    position: 'absolute',
                    top: '30%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '500px',
                    height: '350px',
                    background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.2) 0%, rgba(139, 92, 246, 0.08) 40%, transparent 70%)',
                    filter: 'blur(50px)',
                    pointerEvents: 'none',
                    zIndex: 0,
                }} />
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        mb: 1.5,
                        position: 'relative',
                        zIndex: 1,
                        background: 'linear-gradient(135deg, #ffffff 0%, #A78BFA 50%, #8B5CF6 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        letterSpacing: '-0.02em',
                    }}
                >
                    Connect Your Accounts
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, maxWidth: 400, mx: 'auto', position: 'relative', zIndex: 1 }}>
                    Link Strava and Spotify to automatically match your listening history with every activity.
                </Typography>

                <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <ConnectionVisual
                        stravaConnected={stravaConnected}
                        spotifyConnected={spotifyConnected}
                    />
                </Box>

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
                    {needsStrava && (
                        <Button
                            href={stravaAuthUrl}
                            variant="contained"
                            size="large"
                            sx={{ px: 4, py: 1.25, fontWeight: 600 }}
                        >
                            Connect Strava
                        </Button>
                    )}
                    {needsSpotify && (
                        <Button
                            href={spotifyAuthUrl}
                            variant="contained"
                            size="large"
                            sx={{ px: 4, py: 1.25, fontWeight: 600 }}
                        >
                            Connect Spotify
                        </Button>
                    )}
                </Box>
            </Box>
        </Fade>
    );
};

export default ConnectionFlow;
