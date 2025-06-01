import { Button } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";


const SignupButton = () => {
    const { loginWithRedirect } = useAuth0();
    const handleLogin = async () => {
        await loginWithRedirect({
            screen_hint: "signup",
            appState: {
                returnTo: "/dashboard",
            },
        })
    }
    return <Button color="secondary" variant="contained" onClick={() => handleLogin()}>Sign Up</Button>;
};


export default SignupButton;