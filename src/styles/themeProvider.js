import { createTheme } from '@mui/material/styles';

export const themeOptions = {
    palette: {
        type: 'light',
        primary: {
            main: '#26262d',
            light: '#00c7c0',
            dark: '#000000',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#00afaf',
            light: '#fd4a4a',
            dark: '#000000',
            contrastText: '#ffffff',
        },
        success: {
            main: '#00ff0b',
            contrastText: '#eeff41',
        },
        background: {
            default: '#ffffff',
            paper: '#ffffff',
        },
        text: {
            primary: '#000000',
            secondary: '#000000',
            disabled: '#000000',
            hint: '#ff0000',
        },
        divider: '#ffffff',
        error: {
            main: '#ff1100',
        },
        info: {
            main: '#2196f3',
        },
    },
    typography: {
        fontFamily: 'Roboto, Droid Sans',
    },
};

const theme = createTheme(
    themeOptions
);

export default theme;