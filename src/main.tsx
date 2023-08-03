import 'normalize.css/normalize.css'
import './ui/palette.css'
import './main.css'
import './ui/button/button.css'
import './ui/sidebar/menuItem.css'
import './ui/sidebar/sidebar.css'

import 'inter-ui/inter-latin.css'
import '@fontsource-variable/roboto-mono'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)
