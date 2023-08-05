import { useGameStore } from '../../game/state'
import { UiPages } from './UiPages'
import { WoodTypes } from '../../wood/WoodTypes'

export type Colors = 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'

export const toggle = () => useGameStore.setState((s) => ({ ui: { ...s.ui, open: !s.ui.open } }))
export const setPage = (page: UiPages) => useGameStore.setState((s) => ({ ui: { ...s.ui, page, open: false } }))
export const setWood = (woodType: WoodTypes) => useGameStore.setState((s) => ({ ui: { ...s.ui, woodType } }))

export const collapse = (id: string) =>
    useGameStore.setState((s) => ({
        ui: { ...s.ui, collapsed: { ...s.ui.collapsed, [id]: !(s.ui.collapsed[id] ?? true) } },
    }))
