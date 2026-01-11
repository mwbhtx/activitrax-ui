import { Button } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
    const { loginWithRedirect } = useAuth0();
    const handleLogin = async () => {
        await loginWithRedirect({
            appState: {
                returnTo: "/dashboard",
            },
        });
    };

    return (
        <Button
            variant="outlined"
            fullWidth
            onClick={handleLogin}
            sx={{
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 500,
                borderWidth: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                '&:hover': {
                    borderWidth: 2,
                    backgroundColor: 'rgba(252, 76, 2, 0.12)',
                    transform: 'translateY(-1px)',
                },
                '&:active': {
                    transform: 'translateY(0)',
                },
            }}
        >
            Log In
        </Button>
    );
};

export default LoginButton;