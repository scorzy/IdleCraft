import { useGameStore } from '../../game/state'
import { UiPages } from './UiPages'
import { WoodTypes } from '../../wood/WoodTypes'

export const toggle = () => useGameStore.setState((s) => ({ ui: { ...s.ui, open: !s.ui.open } }))
export const toggleTheme = () => useGameStore.setState((s) => ({ ui: { ...s.ui, dark: !s.ui.dark } }))
export const setPage = (page: UiPages) => useGameStore.setState((s) => ({ ui: { ...s.ui, page } }))
export const setWood = (woodType: WoodTypes) => useGameStore.setState((s) => ({ ui: { ...s.ui, woodType } }))

export type Colors = 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'
