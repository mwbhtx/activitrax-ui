import { AppBar, Box, Button, Divider, Icon, IconButton, Stack, Toolbar, Typography, useTheme } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from "./LogoutButton";
import LoginButton from "./LoginButton";
import SignupButton from "./SignupButton";
import { Link as RouterLink, redirect } from "react-router-dom";
import { Link as MuiLink } from "@mui/material";

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
        }
    }

    return (
        <>
            <AppBar position="sticky">
                <Toolbar>
                    <Stack spacing={2} direction="row" component="div">

                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                        >
                            <MenuIcon />
                        </IconButton>

                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <MuiLink component={RouterLink} to="/" underline="none">
                                <Button variant="text">
                                    <Typography variant="h6" color="primary.contrastText">activitrax.io</Typography>
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