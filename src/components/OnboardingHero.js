import { Box, Button, FormControlLabel, Switch, Typography, Fade, Grow } from "@mui/material";
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
    0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.3); }
    50% { box-shadow: 0 0 40px rgba(139, 92, 246, 0.6); }
`;

// Connection line with animated dots
const ConnectionLine = ({ direction = 'right', active = false }) => (
    <Box sx={{
        display: 'flex',
        alignItems: 'center',
        width: 80,
        justifyContent: 'center',
        position: 'relative',
    }}>
        {/* Base line */}
        <Box sx={{
            height: 2,
            width: '100%',
            backgroundColor: active ? 'primary.main' : 'custom.border',
            borderRadius: 1,
            transition: 'background-color 0.5s ease',
        }} />
        {/* Animated dot */}
        {active && (
            <Box sx={{
                position: 'absolute',
                width: 8,
                height: 8,
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
            <img width={size} height={size} alt={alt} src={logo} style={{ opacity: connected || active ? 1 : 0.5, borderRadius: '50%' }} />
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
const ConnectionVisual = ({ stravaConnected = false, spotifyConnected = false, activeStep = 1 }) => (
    <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        my: 4,
    }}>
        <ServiceNode
            logo={StravaLogo}
            alt="Strava"
            connected={stravaConnected}
            active={activeStep === 1 && !stravaConnected}
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

// Mock activity data for preview
const mockActivities = [
    { name: 'Morning Run', type: 'Run', distance: '5.2 mi', date: 'Today', tracks: 8 },
    { name: 'Evening Cycle', type: 'Ride', distance: '12.4 mi', date: 'Yesterday', tracks: 15 },
    { name: 'Park Run', type: 'Run', distance: '3.1 mi', date: 'Jan 8', tracks: 6 },
    { name: 'Hill Training', type: 'Run', distance: '4.8 mi', date: 'Jan 7', tracks: 10 },
    { name: 'Recovery Jog', type: 'Run', distance: '2.5 mi', date: 'Jan 6', tracks: 5 },
];

// Mock album art gradients to simulate real covers
const albumGradients = [
    'linear-gradient(135deg, #1DB954 0%, #191414 100%)',
    'linear-gradient(135deg, #E91E63 0%, #4A148C 100%)',
    'linear-gradient(135deg, #FF5722 0%, #BF360C 100%)',
    'linear-gradient(135deg, #3F51B5 0%, #1A237E 100%)',
    'linear-gradient(135deg, #9C27B0 0%, #4A148C 100%)',
    'linear-gradient(135deg, #00BCD4 0%, #006064 100%)',
    'linear-gradient(135deg, #FF9800 0%, #E65100 100%)',
    'linear-gradient(135deg, #4CAF50 0%, #1B5E20 100%)',
    'linear-gradient(135deg, #F44336 0%, #B71C1C 100%)',
    'linear-gradient(135deg, #2196F3 0%, #0D47A1 100%)',
    'linear-gradient(135deg, #FFEB3B 0%, #F57F17 100%)',
    'linear-gradient(135deg, #607D8B 0%, #263238 100%)',
];

const MockAlbumArt = ({ index }) => (
    <Box sx={{
        width: 28,
        height: 28,
        borderRadius: 0.5,
        background: albumGradients[index % albumGradients.length],
        flexShrink: 0,
    }} />
);

const MockActivityRow = ({ activity, isLast }) => (
    <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        py: 1.5,
        px: 2,
        borderBottom: isLast ? 'none' : '1px solid',
        borderColor: 'custom.border',
    }}>
        {/* Activity info */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }} noWrap>
                {activity.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
                {activity.type} · {activity.distance} · {activity.date}
            </Typography>
        </Box>
        {/* Track count */}
        <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
            {activity.tracks} tracks
        </Typography>
        {/* Mini album art stack */}
        <Box sx={{ display: 'flex', gap: 0.5 }}>
            {[0, 1, 2].map((i) => (
                <MockAlbumArt key={i} index={i + mockActivities.indexOf(activity)} />
            ))}
        </Box>
        {/* Status indicator */}
        <CheckCircleIcon sx={{ color: 'success.main', fontSize: 18 }} />
    </Box>
);

// Activity preview mockup
const DashboardPreview = () => (
    <Box sx={{
        mt: 5,
        borderRadius: 3,
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'custom.border',
        maxWidth: 550,
        mx: 'auto',
        overflow: 'hidden',
        position: 'relative',
    }}>
        {/* Header */}
        <Box sx={{
            px: 2,
            py: 1.5,
            borderBottom: '1px solid',
            borderColor: 'custom.border',
            backgroundColor: 'background.elevated',
            textAlign: 'center',
        }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                Dashboard Preview
            </Typography>
        </Box>
        {/* Activity rows */}
        {mockActivities.map((activity, index) => (
            <MockActivityRow
                key={activity.name}
                activity={activity}
                isLast={index === mockActivities.length - 1}
            />
        ))}
    </Box>
);

// Hero container with gradient background
const HeroContainer = ({ children }) => (
    <Box sx={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: 3,
        py: 6,
        background: `
            radial-gradient(ellipse at 50% 0%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 40%),
            radial-gradient(ellipse at 20% 80%, rgba(139, 92, 246, 0.08) 0%, transparent 40%)
        `,
    }}>
        {children}
    </Box>
);

// Step indicator dots
const StepIndicator = ({ currentStep, totalSteps }) => (
    <Box sx={{ display: 'flex', gap: 1, mb: 4 }}>
        {Array.from({ length: totalSteps }, (_, i) => (
            <Box
                key={i}
                sx={{
                    width: i + 1 === currentStep ? 24 : 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: i + 1 <= currentStep ? 'primary.main' : 'custom.border',
                    transition: 'all 0.3s ease',
                }}
            />
        ))}
    </Box>
);

// Step 1: Connect Strava
export const StravaConnectHero = ({ stravaAuthUrl }) => (
    <HeroContainer>
        <Fade in timeout={600}>
            <Box sx={{ textAlign: 'center', maxWidth: 600 }}>
                <StepIndicator currentStep={1} totalSteps={3} />

                <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                    Connect Your Accounts
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2, maxWidth: 450, mx: 'auto' }}>
                    Link Strava and Spotify to automatically match your listening history with every activity.
                </Typography>

                <ConnectionVisual activeStep={1} />

                <Button
                    href={stravaAuthUrl}
                    variant="contained"
                    size="large"
                    sx={{
                        px: 6,
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 600,
                        mt: 2,
                    }}
                >
                    Connect Strava
                </Button>

                <DashboardPreview />
            </Box>
        </Fade>
    </HeroContainer>
);

// Step 2: Tracklist preference
export const TracklistPreferenceHero = ({ enabled, onToggle, onContinue }) => (
    <HeroContainer>
        <Fade in timeout={600}>
            <Box sx={{ textAlign: 'center', maxWidth: 600 }}>
                <StepIndicator currentStep={2} totalSteps={3} />

                <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                    Customize Your Experience
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 450, mx: 'auto' }}>
                    Choose how Activitrax updates your Strava activities.
                </Typography>

                <ConnectionVisual stravaConnected activeStep={2} />

                <Box sx={{
                    backgroundColor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'custom.border',
                    borderRadius: 3,
                    p: 3,
                    maxWidth: 450,
                    mx: 'auto',
                    mt: 2,
                }}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={enabled}
                                onChange={onToggle}
                                color="primary"
                            />
                        }
                        label={
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                Add tracklist to activity description
                            </Typography>
                        }
                        sx={{ m: 0, width: '100%', justifyContent: 'space-between', ml: 0 }}
                        labelPlacement="start"
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'left' }}>
                        Your Spotify tracks will appear in your Strava activity description after each workout.
                    </Typography>
                </Box>

                <Button
                    onClick={onContinue}
                    variant="contained"
                    size="large"
                    sx={{
                        px: 6,
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 600,
                        mt: 4,
                    }}
                >
                    Continue
                </Button>
            </Box>
        </Fade>
    </HeroContainer>
);

// Step 3: Connect Spotify (shown after Strava connected, before activities)
export const SpotifyConnectHero = ({ spotifyAuthUrl, onSkip }) => (
    <HeroContainer>
        <Fade in timeout={600}>
            <Box sx={{ textAlign: 'center', maxWidth: 600 }}>
                <StepIndicator currentStep={3} totalSteps={3} />

                <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                    One More Step
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2, maxWidth: 450, mx: 'auto' }}>
                    Connect Spotify to start matching your music with activities.
                </Typography>

                <ConnectionVisual stravaConnected activeStep={3} />

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4 }}>
                    <Button
                        href={spotifyAuthUrl}
                        variant="contained"
                        size="large"
                        sx={{
                            px: 6,
                            py: 1.5,
                            fontSize: '1rem',
                            fontWeight: 600,
                        }}
                    >
                        Connect Spotify
                    </Button>
                </Box>

                {onSkip && (
                    <Button
                        onClick={onSkip}
                        variant="text"
                        sx={{ mt: 2, color: 'text.secondary' }}
                    >
                        Skip for now
                    </Button>
                )}

                <DashboardPreview />
            </Box>
        </Fade>
    </HeroContainer>
);

export { ConnectionVisual };
