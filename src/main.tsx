import './global.css'
import './main.css'
import 'inter-ui/inter-variable-latin.css'

import { TooltipProvider } from '@radix-ui/react-tooltip'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from '@/components/ui/sonner.tsx'
import App from './App.tsx'
import { initialize } from './game/functions/initialize.ts'

initialize()

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <TooltipProvider delayDuration={150}>
            <App />
        </TooltipProvider>
        <Toaster />
    </React.StrictMode>
)
