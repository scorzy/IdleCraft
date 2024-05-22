/* eslint-disable import/default */
import './global.css'
import './main.css'
import 'inter-ui/inter-variable-latin.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { initialize } from './game/initialize.ts'
import { Toaster } from '@/components/ui/toaster'

initialize()

// eslint-disable-next-line import/no-named-as-default-member
ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
        <Toaster />
    </React.StrictMode>
)
