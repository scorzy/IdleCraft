import './main.css'

import 'inter-ui/inter-latin.css'
import '@fontsource-variable/roboto-mono'

import {
    Experimental_CssVarsProvider as CssVarsProvider,
    StyledEngineProvider,
    experimental_extendTheme as extendTheme,
} from '@mui/material/styles'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import CssBaseline from '@mui/material/CssBaseline'

const theme = extendTheme({
    typography: {
        fontFamily: [
            'Inter var',
            'Inter',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
    },
    components: {
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    borderRadius: 'var(--radius)',
                },
            },
        },
        MuiButton: {
            defaultProps: {
                variant: 'contained',
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 'var(--radius)',
                },
            },
        },
        MuiListItemIcon: {
            styleOverrides: {
                root: {
                    minWidth: '36px',
                },
            },
        },
    },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <StyledEngineProvider injectFirst>
            <CssVarsProvider theme={theme}>
                <CssBaseline />
                <App />
            </CssVarsProvider>
        </StyledEngineProvider>
    </React.StrictMode>
)
