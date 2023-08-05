import 'normalize.css/normalize.css'
import './ui/palette.css'
import './main.css'
import './ui/button/button.css'

import 'inter-ui/inter-latin.css'
import '@fontsource-variable/roboto-mono'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

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
