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
        },
        text: {
            primary: '#ffffff',
            secondary: 'rgba(255, 255, 255, 0.7)',
            disabled: 'rgba(255, 255, 255, 0.5)',
        },
        divider: 'rgba(139, 92, 246, 0.15)',
        error: {
            main: '#EF4444',
        },
        warning: {
            main: '#F59E0B',
        },
        info: {
            main: '#A78BFA',
        },
        action: {
            hover: 'rgba(139, 92, 246, 0.08)',
            selected: 'rgba(139, 92, 246, 0.16)',
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
                        color: '#ffffff',
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
    },
};

const theme = createTheme(themeOptions);

export default theme;
