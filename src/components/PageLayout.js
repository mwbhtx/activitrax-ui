import { Box } from "@mui/material";
import AppHeader from "./AppHeader";

/**
 * PageLayout component provides a consistent layout structure where:
 * - The AppHeader is fixed at the top
 * - The main content area scrolls independently below the header
 * - The scrollbar only appears for the content area, not the entire page
 */
export default function PageLayout({ children }) {
    return (
        <>
            <AppHeader />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    overflow: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {children}
            </Box>
        </>
    );
}
