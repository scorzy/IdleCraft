import './main.css'

import '@fontsource/public-sans/index.css'
import '@fontsource/public-sans/500.css'
import '@fontsource/public-sans/600.css'

import '@fontsource/inconsolata'
import '@fontsource/inconsolata/500.css'
import '@fontsource/inconsolata/600.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { CssVarsProvider, extendTheme } from '@mui/joy/styles'
import CssBaseline from '@mui/joy/CssBaseline'

const theme = extendTheme({
    components: {
        JoyList: {
            styleOverrides: {
                root: {
                    '--ListDivider-gap': '0',
                },
            },
        },
    },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <CssVarsProvider theme={theme}>
            <CssBaseline />
            <App />
        </CssVarsProvider>
    </React.StrictMode>
)
