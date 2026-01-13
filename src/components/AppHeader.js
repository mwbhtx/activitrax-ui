import { AppBar, Box, Button, Drawer, IconButton, Stack, Toolbar, Typography, useTheme } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from "./LogoutButton";
import { Link as RouterLink } from "react-router-dom";
import { Link as MuiLink } from "@mui/material";
import { useState } from "react";
import GridViewIcon from '@mui/icons-material/GridView';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

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
            color: 'text.primary',
            '&:hover': {
                backgroundColor: 'action.hover',
            },
        },
        drawerNavLinkButtons: {
            width: '220px',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            color: 'text.highlight',
            padding: '12px 16px',
            '&:hover': {
                backgroundColor: 'action.focus',
                color: 'primary.light',
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
            backgroundColor: 'background.paper',
            borderRight: '1px solid',
            borderRightColor: 'divider',
        },
        logoutButton: {
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            "&.MuiButton-contained": {
                backgroundColor: 'primary.main',
                "&:hover": {
                    backgroundColor: 'primary.dark',
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
                {/* Navigation Link To Liked Tracks */}
                <Button sx={styles.drawerNavLinkButtons} component={RouterLink} to="/liked-tracks" onClick={toggleDrawer(false)}>
                    <FavoriteIcon sx={{ m: 1 }} />
                    <Typography>Liked Tracks</Typography>
                </Button>
                {/* Navigation Link To Settings with Gear Icon */}
                <Button sx={styles.drawerNavLinkButtons} component={RouterLink} to="/settings" onClick={toggleDrawer(false)}>
                    <SettingsApplicationsIcon sx={{ m: 1 }} />
                    <Typography>Settings</Typography>
                </Button>
                {/* Navigation Link To About */}
                <Button sx={styles.drawerNavLinkButtons} component={RouterLink} to="/about" onClick={toggleDrawer(false)}>
                    <InfoOutlinedIcon sx={{ m: 1 }} />
                    <Typography>About</Typography>
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
                disableScrollLock
            >
                {drawerList()}
            </Drawer>
            <AppBar
                position="sticky"
                elevation={0}
                sx={{
                    backgroundColor: 'rgba(15, 11, 26, 0.9)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    borderBottom: '1px solid rgba(139, 92, 246, 0.15)',
                    // Bottom glow line
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -1,
                        left: '20%',
                        right: '20%',
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
                                            background: (theme) => `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.secondary.main} 100%)`,
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            backgroundClip: 'text',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                background: (theme) => `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
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
                                        color: 'text.highlight',
                                        px: 2,
                                        py: 1,
                                        borderRadius: 2,
                                        '&:hover': {
                                            backgroundColor: 'action.focus',
                                            color: 'primary.light',
                                        },
                                    }}
                                >
                                    Dashboard
                                </Button>
                            </MuiLink>

                            <MuiLink component={RouterLink} to="/liked-tracks" underline="none">
                                <Button
                                    variant="text"
                                    startIcon={<FavoriteIcon />}
                                    sx={{
                                        color: 'text.highlight',
                                        px: 2,
                                        py: 1,
                                        borderRadius: 2,
                                        '&:hover': {
                                            backgroundColor: 'action.focus',
                                            color: 'primary.light',
                                        },
                                    }}
                                >
                                    Liked Tracks
                                </Button>
                            </MuiLink>

                            <MuiLink component={RouterLink} to="/settings" underline="none">
                                <Button
                                    variant="text"
                                    startIcon={<SettingsApplicationsIcon />}
                                    sx={{
                                        color: 'text.highlight',
                                        px: 2,
                                        py: 1,
                                        borderRadius: 2,
                                        '&:hover': {
                                            backgroundColor: 'action.focus',
                                            color: 'primary.light',
                                        },
                                    }}
                                >
                                    Settings
                                </Button>
                            </MuiLink>

                            <MuiLink component={RouterLink} to="/about" underline="none">
                                <Button
                                    variant="text"
                                    startIcon={<InfoOutlinedIcon />}
                                    sx={{
                                        color: 'text.highlight',
                                        px: 2,
                                        py: 1,
                                        borderRadius: 2,
                                        '&:hover': {
                                            backgroundColor: 'action.focus',
                                            color: 'primary.light',
                                        },
                                    }}
                                >
                                    About
                                </Button>
                            </MuiLink>

                            <Box sx={{ width: '1px', height: 24, backgroundColor: 'custom.glassBg', mx: 1 }} />

                            <LogoutButton />
                        </Stack>
                    )}
                </Toolbar>
            </AppBar>
        </>
    )
}