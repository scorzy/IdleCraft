import './global.css'
import './main.css'
import 'inter-ui/inter-variable-latin.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from '@/components/ui/sonner.tsx'
import App from './App.tsx'
import { initialize } from './game/functions/initialize.ts'
import { TooltipProvider } from './components/ui/tooltip.tsx'

initialize()

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <TooltipProvider>
            <App />
        </TooltipProvider>
        <Toaster />
    </React.StrictMode>
)
