import { useEffect } from 'react'
import { useGameStore } from '../game/state'
import { selectTheme, selectThemeColor } from './state/uiSelectors'

export function ThemeProvider() {
    const theme = useGameStore(selectTheme)
    const themeColor = useGameStore(selectThemeColor)

    useEffect(() => {
        const root = window.document.documentElement

        const toRemove: string[] = ['light', 'dark']
        root.classList.forEach((c) => {
            if (c.startsWith('theme-')) toRemove.push(c)
        })

        root.classList.remove(...toRemove)
        let themeClass = theme

        if (theme === 'system')
            themeClass = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

        root.classList.add(themeClass)
        const dark = themeClass === 'dark' ? 'dark-' : ''
        if (themeColor !== '') root.classList.add(`theme-${dark}${themeColor}`)
    }, [theme, themeColor])
}
