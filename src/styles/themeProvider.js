import { createTheme } from '@mui/material/styles';

export const themeOptions = {
    palette: {
        mode: 'dark',
        primary: {
            main: '#8B5CF6',
            light: '#A78BFA',
            dark: '#7C3AED',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#C4B5FD',
            light: '#DDD6FE',
            dark: '#A78BFA',
            contrastText: '#000000',
        },
        success: {
            main: '#22C55E',
            contrastText: '#ffffff',
        },
        background: {
            default: '#0F0B1A',
            paper: '#1A1425',
            elevated: '#241D30',
        },
        text: {
            primary: '#ffffff',
            secondary: 'rgba(255, 255, 255, 0.7)',
            disabled: 'rgba(255, 255, 255, 0.5)',
            muted: 'rgba(255, 255, 255, 0.4)',
            highlight: 'rgba(255, 255, 255, 0.9)',
        },
        divider: 'rgba(139, 92, 246, 0.15)',
        error: {
            main: '#EF4444',
            light: '#ff5252',
        },
        warning: {
            main: '#F59E0B',
            light: '#f5a623',
        },
        info: {
            main: '#A78BFA',
        },
        action: {
            hover: 'rgba(139, 92, 246, 0.08)',
            selected: 'rgba(139, 92, 246, 0.16)',
            focus: 'rgba(139, 92, 246, 0.12)',
            disabledBackground: 'rgba(139, 92, 246, 0.04)',
        },
        custom: {
            border: 'rgba(255, 255, 255, 0.08)',
            borderLight: 'rgba(255, 255, 255, 0.1)',
            borderMedium: 'rgba(255, 255, 255, 0.12)',
            overlay: 'rgba(0, 0, 0, 0.3)',
            overlayDark: 'rgba(0, 0, 0, 0.8)',
            glassBg: 'rgba(255, 255, 255, 0.15)',
            glassBorder: 'rgba(255, 255, 255, 0.3)',
            appBarBg: 'rgba(26, 20, 37, 0.8)',
            miniPlayerBg: 'rgba(26, 20, 37, 0.95)',
            primaryGlow: 'rgba(139, 92, 246, 0.5)',
            primarySubtle: 'rgba(139, 92, 246, 0.1)',
            primaryFaint: 'rgba(139, 92, 246, 0.04)',
            progressBg: 'rgba(139, 92, 246, 0.2)',
            progressBgDim: 'rgba(139, 92, 246, 0.3)',
            scrollbarThumb: '#3a3a3a',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h6: {
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backgroundColor: '#1A1425',
                    border: '1px solid rgba(139, 92, 246, 0.15)',
                    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                        borderColor: 'rgba(139, 92, 246, 0.4)',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backgroundColor: '#1A1425',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 500,
                    borderRadius: 8,
                    transition: 'all 0.2s ease',
                },
                contained: {
                    backgroundColor: '#8B5CF6',
                    '&:hover': {
                        backgroundColor: '#7C3AED',
                    },
                },
                outlined: {
                    borderColor: 'rgba(139, 92, 246, 0.5)',
                    color: '#A78BFA',
                    '&:hover': {
                        borderColor: '#8B5CF6',
                        backgroundColor: 'rgba(139, 92, 246, 0.08)',
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#1A1425',
                    borderBottom: '1px solid rgba(139, 92, 246, 0.15)',
                    boxShadow: 'none',
                },
            },
        },
        MuiTableHead: {
            styleOverrides: {
                root: {
                    '& .MuiTableCell-head': {
                        backgroundColor: '#8B5CF6',
                        color: '#000000',
                        fontWeight: 600,
                    },
                },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    '&:hover': {
                        backgroundColor: 'rgba(139, 92, 246, 0.04)',
                    },
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottomColor: 'rgba(139, 92, 246, 0.15)',
                },
            },
        },
        MuiSwitch: {
            styleOverrides: {
                switchBase: {
                    '&.Mui-checked': {
                        color: '#8B5CF6',
                        '& + .MuiSwitch-track': {
                            backgroundColor: '#8B5CF6',
                        },
                    },
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: '#1A1425',
                    borderRight: '1px solid rgba(139, 92, 246, 0.15)',
                },
            },
        },
        MuiMenu: {
            styleOverrides: {
                paper: {
                    backgroundColor: '#241D30',
                    border: '1px solid rgba(139, 92, 246, 0.15)',
                },
            },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    '&:hover': {
                        backgroundColor: 'rgba(139, 92, 246, 0.08)',
                    },
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    transition: 'all 0.2s ease',
                },
            },
        },
        MuiCircularProgress: {
            styleOverrides: {
                colorSecondary: {
                    color: '#8B5CF6',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: '#241D30',
                        '& fieldset': {
                            borderColor: 'rgba(139, 92, 246, 0.15)',
                        },
                        '&:hover fieldset': {
                            borderColor: 'rgba(139, 92, 246, 0.4)',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#8B5CF6',
                        },
                    },
                },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                root: {
                    fontFamily: 'monospace',
                },
            },
        },
    },
};

const theme = createTheme(themeOptions);

export default theme;
