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
                borderColor: { xs: 'rgba(139, 92, 246, 0.5)', sm: 'custom.overlay' },
                color: { xs: '#ffffff', sm: 'secondary.contrastText' },
                backgroundColor: { xs: 'rgba(139, 92, 246, 0.1)', sm: 'custom.borderLight' },
                '&:hover': {
                    borderWidth: 2,
                    borderColor: { xs: 'rgba(139, 92, 246, 0.8)', sm: 'custom.overlayDark' },
                    backgroundColor: { xs: 'rgba(139, 92, 246, 0.2)', sm: 'custom.glassBg' },
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