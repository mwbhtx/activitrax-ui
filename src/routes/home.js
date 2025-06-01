import { useAuth0 } from "@auth0/auth0-react";
import { Paper, Stack, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Navigate } from "react-router";
import AppHeader from "../components/AppHeader";
import LoginButton from "../components/LoginButton";
import SignupButton from "../components/SignupButton";
import ActivitraxLogo from "../images/activitrax-logo.svg";
import RunningImage01 from "../images/pexels-rosemary-ketchum-1564466.jpg";


export default function Home() {

    const { isLoading, isAuthenticated } = useAuth0();

    if (isLoading) {
        return (
            null
        )
    }

    return (
        <>
            <AppHeader />
            {isAuthenticated ? <Navigate to="/dashboard" /> : <HomeComponent />}
        </>
    )
}

const HomeComponent = () => {

    return (
        <>
            {/* <img width={'100%'} height={'100%'} alt="test img" src={RunningImage01} /> */}
            <Grid2 container sx={{ backgroundSize: 'cover', backgroundImage: `url(${RunningImage01})`, position: 'absolute', bottom: 0, right: 0, top: 0, left: 0 }}>
                <Grid2 xs={16} display="flex" justifyContent="center" alignItems="center">
                    <AuthDialog />
                </Grid2>
            </Grid2>
        </>
    )
}

function AuthDialog(props) {

    return (
        <>
            <Paper elevation={0} sx={{ width: 300, p: 3, m: 3 }}>
                <Stack spacing={10} direction="column">
                    <Stack spacing={2}>
                        <Stack spacing={2}>
                            <img width={'100%'} height={200} alt="Activitrax Logo" src={ActivitraxLogo} />
                        </Stack>
                        <Typography variant="body2" sx={{ fontSize: 16, fontWeight: 400, textAlign: 'center' }}>
                            Synchronize your Strava activities with your favorite music streaming service.
                        </Typography>
                    </Stack>
                    <Stack spacing={2}>
                        <LoginButton />
                        <SignupButton />
                    </Stack>
                </Stack>
            </Paper>
        </>
    )
}