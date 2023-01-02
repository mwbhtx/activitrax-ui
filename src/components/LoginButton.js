import { Button } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import '../styles/App.css';

const LoginButton = () => {
    const { loginWithRedirect } = useAuth0();
    const handleLogin = async () => {
        await loginWithRedirect({
            appState: {
                returnTo: "/dashboard",
            },
        })
    }
    return (
        <>
            <Button variant="contained" sx={{ width: '100%', whiteSpace: 'nowrap' }} onClick={handleLogin}>Login</Button>
        </>
    )
};


export default LoginButton;