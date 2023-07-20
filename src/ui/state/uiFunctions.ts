import { useGameStore } from '../../game/state'

export const toggle = () => useGameStore.setState((s) => ({ open: !s.open }))
export const toggleTheme = () => useGameStore.setState((s) => ({ dark: !s.dark }))
