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
                fontWeight: 600,
                borderWidth: 2,
                borderColor: 'rgba(0, 0, 0, 0.3)',
                color: '#000',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                    borderWidth: 2,
                    borderColor: 'rgba(0, 0, 0, 0.5)',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
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