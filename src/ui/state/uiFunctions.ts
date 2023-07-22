import { useGameStore } from '../../game/state'
import { UiPages } from './UiPages'

export const toggle = () => useGameStore.setState((s) => ({ ui: { ...s.ui, open: !s.ui.open } }))
export const toggleTheme = () => useGameStore.setState((s) => ({ ui: { ...s.ui, dark: !s.ui.dark } }))
export const setPage = (page: UiPages) => useGameStore.setState((s) => ({ ui: { ...s.ui, page } }))
