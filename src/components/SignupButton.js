import { Button } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";

const SignupButton = () => {
    const { loginWithRedirect } = useAuth0();
    const handleSignup = async () => {
        await loginWithRedirect({
            screen_hint: "signup",
            appState: {
                returnTo: "/dashboard",
            },
        });
    };

    return (
        <Button
            variant="contained"
            fullWidth
            onClick={handleSignup}
            aria-label="Create a new account"
            sx={{
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                boxShadow: '0 4px 14px rgba(252, 76, 2, 0.4)',
                '&:hover': {
                    boxShadow: '0 6px 20px rgba(252, 76, 2, 0.5)',
                    transform: 'translateY(-1px)',
                },
                '&:active': {
                    transform: 'translateY(0)',
                },
            }}
        >
            Get Started
        </Button>
    );
};

export default SignupButton;