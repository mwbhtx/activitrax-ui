import { Box, Button, FormControlLabel, Paper, Switch, Typography } from "@mui/material";
import StravaLogo from '../images/strava-2.svg';

export const StravaConnectStep = ({ onConnect, stravaAuthUrl }) => {
    return (
        <OnboardingCard
            step={1}
            totalSteps={2}
            logo={StravaLogo}
            logoAlt="Strava Logo"
            title="Connect Strava"
            description="Link your Strava account to sync your activities and match them with your listening history."
            action={
                <Button
                    href={stravaAuthUrl}
                    variant="contained"
                    fullWidth
                >
                    Connect Strava
                </Button>
            }
        />
    );
};

export const TracklistPreferenceStep = ({ enabled, onToggle, onContinue }) => {
    return (
        <OnboardingCard
            step={2}
            totalSteps={2}
            logo={StravaLogo}
            logoAlt="Strava Logo"
            title="Activity Description"
            description="Would you like your Spotify tracklist automatically added to your Strava activity descriptions?"
            action={
                <>
                    <Box sx={{
                        backgroundColor: 'action.disabledBackground',
                        borderRadius: 2,
                        p: 2,
                        mb: 3
                    }}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={enabled}
                                    onChange={onToggle}
                                    color="primary"
                                />
                            }
                            label="Add tracklist to activity description"
                            sx={{ m: 0 }}
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, ml: 6 }}>
                            Your Spotify tracks will appear in your Strava activity details.
                        </Typography>
                    </Box>
                    <Button
                        onClick={onContinue}
                        variant="contained"
                        fullWidth
                    >
                        Continue
                    </Button>
                </>
            }
        />
    );
};

const OnboardingCard = ({ step, totalSteps, logo, logoAlt, title, description, action }) => {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mt: 4
        }}>
            <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2 }}
            >
                Step {step} of {totalSteps}
            </Typography>
            <Paper
                elevation={0}
                sx={{
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    p: 4,
                    border: '1px solid',
                    borderColor: 'custom.border',
                    borderRadius: 3,
                    maxWidth: 450,
                    width: '100%',
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                    <Box sx={{
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: 'custom.primarySubtle',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <img width={40} height={40} alt={logoAlt} src={logo} />
                    </Box>
                </Box>
                <Typography
                    variant="h6"
                    sx={{
                        mb: 1,
                        fontWeight: 600,
                        textAlign: 'center'
                    }}
                >
                    {title}
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        mb: 3,
                        fontWeight: 400,
                        textAlign: 'center',
                        color: 'text.secondary'
                    }}
                >
                    {description}
                </Typography>
                {action}
            </Paper>
        </Box>
    );
};

export default OnboardingCard;
