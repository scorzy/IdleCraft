import './global.css'
import './main.css'

import 'inter-ui/inter-latin.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { populateProvider } from './game/populateProvider.ts'

populateProvider()

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)
