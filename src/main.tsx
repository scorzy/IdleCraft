import './global.css'
import './main.css'

import 'inter-ui/inter-latin.css'
import '@fontsource-variable/roboto-mono'
import '@fontsource-variable/raleway'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { ThemeProvider } from './ui/themeProvider.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <App />
        </ThemeProvider>
    </React.StrictMode>
)
