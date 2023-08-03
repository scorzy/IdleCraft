import { useEffect } from 'react'
import { GameState } from '../game/GameState'
import { useGameStore } from '../game/state'

const selectTheme = (s: GameState) => s.ui.dark
export function useTheme() {
    const dark = useGameStore(selectTheme)

    useEffect(() => {
        document.documentElement.setAttribute('theme', dark ? 'dark' : 'light')
    }, [dark])
}
