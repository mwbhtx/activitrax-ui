import { createTheme } from '@mui/material/styles';

export const themeOptions = {
    palette: {
        mode: 'dark',
        primary: {
            main: '#FC4C02',
            light: '#FF6B2C',
            dark: '#D94000',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#FF8A65',
            light: '#FFAB91',
            dark: '#E64A19',
            contrastText: '#000000',
        },
        success: {
            main: '#22C55E',
            contrastText: '#ffffff',
        },
        background: {
            default: '#121212',
            paper: '#1e1e1e',
        },
        text: {
            primary: '#ffffff',
            secondary: 'rgba(255, 255, 255, 0.7)',
            disabled: 'rgba(255, 255, 255, 0.5)',
        },
        divider: 'rgba(255, 255, 255, 0.12)',
        error: {
            main: '#ff5252',
        },
        warning: {
            main: '#f5a623',
        },
        info: {
            main: '#FF8A65',
        },
        action: {
            hover: 'rgba(255, 138, 101, 0.08)',
            selected: 'rgba(255, 138, 101, 0.16)',
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
                    backgroundColor: '#1e1e1e',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                        borderColor: 'rgba(255, 138, 101, 0.3)',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backgroundColor: '#1e1e1e',
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
                    backgroundColor: '#FC4C02',
                    '&:hover': {
                        backgroundColor: '#D94000',
                    },
                },
                outlined: {
                    borderColor: 'rgba(252, 76, 2, 0.5)',
                    color: '#FC4C02',
                    '&:hover': {
                        borderColor: '#FC4C02',
                        backgroundColor: 'rgba(252, 76, 2, 0.08)',
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#1e1e1e',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: 'none',
                },
            },
        },
        MuiTableHead: {
            styleOverrides: {
                root: {
                    '& .MuiTableCell-head': {
                        backgroundColor: '#FC4C02',
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
                        backgroundColor: 'rgba(255, 138, 101, 0.04)',
                    },
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
                },
            },
        },
        MuiSwitch: {
            styleOverrides: {
                switchBase: {
                    '&.Mui-checked': {
                        color: '#FC4C02',
                        '& + .MuiSwitch-track': {
                            backgroundColor: '#FC4C02',
                        },
                    },
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: '#1e1e1e',
                    borderRight: '1px solid rgba(255, 255, 255, 0.08)',
                },
            },
        },
        MuiMenu: {
            styleOverrides: {
                paper: {
                    backgroundColor: '#2a2a2a',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                },
            },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    '&:hover': {
                        backgroundColor: 'rgba(255, 138, 101, 0.08)',
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
                    color: '#FC4C02',
                },
            },
        },
    },
};

const theme = createTheme(themeOptions);

export default theme;