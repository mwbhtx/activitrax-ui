import { AppBar, Box, Button, Drawer, IconButton, Stack, Toolbar, Typography, useTheme } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from "./LogoutButton";
import LoginButton from "./LoginButton";
import SignupButton from "./SignupButton";
import { Link as RouterLink } from "react-router-dom";
import { Link as MuiLink } from "@mui/material";
import { useState } from "react";
import GridViewIcon from '@mui/icons-material/GridView';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';

export default function AppHeader(props) {
    const { isAuthenticated } = useAuth0();

    // import useTheme hook so we can apply some breakpoints in our styles
    const theme = useTheme();

    const styles = {
        largeNavButtons: {
            [theme.breakpoints.down('md')]: {
                display: 'none',
            }
        },
        drawerButton: {
            [theme.breakpoints.up('md')]: {
                display: 'none',
            },
            color: '#ffffff',
            '&:hover': {
                backgroundColor: 'rgba(139, 92, 246, 0.08)',
            },
        },
        drawerNavLinkButtons: {
            width: '220px',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            color: 'rgba(255, 255, 255, 0.9)',
            padding: '12px 16px',
            '&:hover': {
                backgroundColor: 'rgba(139, 92, 246, 0.12)',
                color: '#A78BFA',
            },
            borderRadius: '0px',
            transition: 'all 0.2s ease',
        },
        drawerContainer: {
            width: '220px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: '#1A1425',
            borderRight: '1px solid rgba(139, 92, 246, 0.15)',
        },
        logoutButton: {
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            "&.MuiButton-contained": {
                backgroundColor: '#8B5CF6',
                "&:hover": {
                    backgroundColor: '#7C3AED',
                },
                textAlign: "left",
                borderRadius: "0px",
            },
        }
    }

    // list side menu navigation options
    const drawerList = () => (

        // Place stack in container and float logout button to the bottom
        <Box sx={styles.drawerContainer}>
            <Stack spacing={0} direction="column">
                {/* Navigation Link With Dashboard Icon */}
                <Button sx={styles.drawerNavLinkButtons} component={RouterLink} to="/dashboard" onClick={toggleDrawer(false)}>
                    <GridViewIcon sx={{ m: 1 }} />
                    <Typography>Dashboard</Typography>
                </Button>
                {/* Navigation Link To Settings with Gear Icon */}
                <Button sx={styles.drawerNavLinkButtons} component={RouterLink} to="/settings" onClick={toggleDrawer(false)}>
                    <SettingsApplicationsIcon sx={{ m: 1 }} />
                    <Typography>Settings</Typography>
                </Button>
            </Stack>
            {/* Logout Button */}
            <LogoutButton customStyles={styles.logoutButton} />
        </Box>

    );

    const [drawerAnchorOpenState, setDrawerAnchorOpenState] = useState(false);

    const toggleDrawer = (open) => {
        return (event) => {
            if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
                return;
            }
            setDrawerAnchorOpenState(open);
        };
    }

    const drawerAnchor = 'left'

    return (
        <>
            <Drawer
                anchor={drawerAnchor}
                open={drawerAnchorOpenState}
                onClose={toggleDrawer(false)}
            >
                {drawerList()}
            </Drawer>
            <AppBar
                position="sticky"
                elevation={0}
                sx={{
                    backgroundColor: 'rgba(26, 20, 37, 0.8)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderBottom: '1px solid rgba(139, 92, 246, 0.15)',
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '1px',
                        background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.5), transparent)',
                    },
                }}
            >
                <Toolbar>
                    <Stack spacing={2} direction="row" component="div" alignItems="center">
                        {isAuthenticated && (
                            <IconButton
                                sx={styles.drawerButton}
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                onClick={toggleDrawer(true)}
                            >
                                <MenuIcon />
                            </IconButton>
                        )}

                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <MuiLink component={RouterLink} to="/" underline="none">
                                <Button
                                    variant="text"
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: 'transparent',
                                        },
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 700,
                                            background: 'linear-gradient(135deg, #ffffff 0%, #C4B5FD 100%)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            backgroundClip: 'text',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #C4B5FD 0%, #8B5CF6 100%)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                backgroundClip: 'text',
                                            },
                                        }}
                                    >
                                        activitrax.app
                                    </Typography>
                                </Button>
                            </MuiLink>
                        </Box>
                    </Stack>
                    <Box sx={{ flexGrow: 1 }} />
                    {isAuthenticated && (
                        <Stack spacing={1.5} direction="row" sx={styles.largeNavButtons} alignItems="center">
                            <MuiLink component={RouterLink} to="/dashboard" underline="none">
                                <Button
                                    variant="text"
                                    startIcon={<GridViewIcon />}
                                    sx={{
                                        color: 'rgba(255, 255, 255, 0.8)',
                                        px: 2,
                                        py: 1,
                                        borderRadius: 2,
                                        '&:hover': {
                                            backgroundColor: 'rgba(139, 92, 246, 0.12)',
                                            color: '#A78BFA',
                                        },
                                    }}
                                >
                                    Dashboard
                                </Button>
                            </MuiLink>

                            <MuiLink component={RouterLink} to="/settings" underline="none">
                                <Button
                                    variant="text"
                                    startIcon={<SettingsApplicationsIcon />}
                                    sx={{
                                        color: 'rgba(255, 255, 255, 0.8)',
                                        px: 2,
                                        py: 1,
                                        borderRadius: 2,
                                        '&:hover': {
                                            backgroundColor: 'rgba(139, 92, 246, 0.12)',
                                            color: '#A78BFA',
                                        },
                                    }}
                                >
                                    Settings
                                </Button>
                            </MuiLink>

                            <Box sx={{ width: '1px', height: 24, backgroundColor: 'rgba(255, 255, 255, 0.2)', mx: 1 }} />

                            <LogoutButton />
                        </Stack>
                    )}
                </Toolbar>
            </AppBar>
        </>
    )
}