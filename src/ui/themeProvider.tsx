import { useEffect } from 'react'
import { useGameStore } from '../game/state'
import { selectTheme } from './state/uiSelectors'

export function ThemeProvider() {
    const theme = useGameStore(selectTheme)

    useEffect(() => {
        const root = window.document.documentElement

        root.classList.remove('light', 'dark')

        if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

            root.classList.add(systemTheme)
            return
        }

        root.classList.add(theme)
    }, [theme])
}
