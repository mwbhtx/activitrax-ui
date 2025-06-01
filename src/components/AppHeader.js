import { AppBar, Box, Button, Drawer, IconButton, Stack, Toolbar, Typography, useTheme } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from "./LogoutButton";
import LoginButton from "./LoginButton";
import SignupButton from "./SignupButton";
import { Link as RouterLink } from "react-router-dom";
import { Link as MuiLink } from "@mui/material";
import { Fragment, useState } from "react";
import GridViewIcon from '@mui/icons-material/GridView';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';

export default function AppHeader(props) {
    const { isAuthenticated } = useAuth0();

    // import useTheme hook so we can apply some breakpoints in our styles
    const theme = useTheme();

    // create a styles object where each key acts similar to a class name
    // apply the styling to components by passing the desired key to the component's sx prop
    const styles = {
        largeNavButtons: {
            [theme.breakpoints.down('md')]: {   // apply styles when screen width is less than 960px
                display: 'none',
            }
        },
        drawerButton: {
            [theme.breakpoints.up('md')]: {   // apply styles when screen width is less than 960px
                display: 'none',
            }
        },
        drawerNavLinkButtons: {
            width: '200px',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            color: 'white',
            // add hover effect
            '&:hover': {
                backgroundColor: theme.palette.primary.light,
            },
            // adjust border radius
            borderRadius: '0px',
        },
        // Styles drawer container with the same background color as the app bar
        drawerContainer: {
            width: '200px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: theme.palette.primary.main,
        },
        logoutButton: {
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            // override contained variant styles
            "&.MuiButton-contained": {
                // override default background color
                backgroundColor: theme.palette.secondary.main,
                // override default hover background color
                "&:hover": {
                    backgroundColor: theme.palette.secondary.dark,
                },
                // override text alignment of button label
                textAlign: "left",
                // override corners of button
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
            <AppBar position="sticky">
                <Toolbar>
                    <Stack spacing={2} direction="row" component="div">

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
                                <Button variant="text">
                                    <Typography variant="h6" color="primary.contrastText">activitrax.app</Typography>
                                </Button>
                            </MuiLink>
                        </Box>

                    </Stack>
                    <Box sx={{ flexGrow: 1 }} />
                    {isAuthenticated && (
                        <Stack spacing={2} direction="row" sx={styles.largeNavButtons}>
                            <MuiLink component={RouterLink} to="/dashboard" underline="none">
                                <Button variant="outlined" color="secondary">Dashboard</Button>
                            </MuiLink>

                            <MuiLink component={RouterLink} to="/settings" underline="none">
                                <Button variant="outlined" color="secondary">Settings</Button>
                            </MuiLink>

                            {isAuthenticated && (
                                <>
                                    <LogoutButton />
                                </>
                            )}
                            {!isAuthenticated && (
                                <>
                                    <LoginButton />
                                    <SignupButton />
                                </>
                            )}
                        </Stack>
                    )}

                </Toolbar>
            </AppBar>
        </>
    )
}