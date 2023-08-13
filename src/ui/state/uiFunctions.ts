import { useGameStore } from '../../game/state'
import { UiPages } from './UiPages'
import { WoodTypes } from '../../wood/WoodTypes'
import { UiPagesData } from './UiPagesData'
import { GameState } from '../../game/GameState'

export type Colors = 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'

export const toggle = () => useGameStore.setState((s) => ({ ui: { ...s.ui, open: !s.ui.open } }))
export const setPage = (page: UiPages) =>
    useGameStore.setState((s) => {
        const data = UiPagesData[page]
        return { ui: { ...s.ui, page, open: false, recipeType: data.recipeType } }
    })
export const setWood = (woodType: WoodTypes) => useGameStore.setState((s) => ({ ui: { ...s.ui, woodType } }))

export const isCollapsed = (id: string) => (s: GameState) => {
    if (id in s.ui.collapsed) return s.ui.collapsed[id]
    return false
}
export const collapse = (id: string) =>
    useGameStore.setState((s) => {
        const col = isCollapsed(id)(s)
        if (!col) return { ui: { ...s.ui, collapsed: { ...s.ui.collapsed, [id]: true } } }
        else {
            const { [id]: value, ...collapsed } = s.ui.collapsed
            return {
                ui: { ...s.ui, collapsed },
            }
        }
    })
