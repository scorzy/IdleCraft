import { useGameStore } from '../../game/state'
import { UiPages } from './UiPages'
import { WoodTypes } from '../../wood/WoodTypes'
import { UiPagesData } from './UiPagesData'
import { GameState } from '../../game/GameState'
import { OreTypes } from '../../mining/OreTypes'
import { changeRecipeState } from '../../crafting/CraftingFunctions'

export type Colors = 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'
export type StorageOrder = 'name' | 'quantity' | 'value'

export const setTheme = (theme: string) => useGameStore.setState((s) => ({ ui: { ...s.ui, theme } }))
export const toggle = () => useGameStore.setState((s) => ({ ui: { ...s.ui, open: !s.ui.open } }))
export const setPage = (page: UiPages) =>
    useGameStore.setState((s) => {
        const data = UiPagesData[page]

        if (s.ui.recipeType !== data.recipeType) s = changeRecipeState(s, '')

        return { ...s, ui: { ...s.ui, page, open: false, recipeType: data.recipeType } }
    })
export const setWood = (woodType: WoodTypes) => useGameStore.setState((s) => ({ ui: { ...s.ui, woodType } }))
export const setOre = (oreType: OreTypes) => useGameStore.setState((s) => ({ ui: { ...s.ui, oreType } }))

export const setStorageOrder = (order: StorageOrder, asc: boolean) => () =>
    useGameStore.setState((s) => ({ ui: { ...s.ui, storageOrder: order, storageAsc: asc } }))

export const sidebarCollapsed = (state: GameState) => state.ui.sidebarCollapsed
export const toggleSidebar = () =>
    useGameStore.setState((s) => ({
        ui: { ...s.ui, sidebarCollapsed: !s.ui.sidebarCollapsed },
    }))

export const gatheringCollapsed = (state: GameState) => state.ui.gatheringCollapsed
export const toggleGathering = () =>
    useGameStore.setState((s) => ({
        ui: { ...s.ui, gatheringCollapsed: !s.ui.gatheringCollapsed },
    }))

export const craftingCollapsed = (state: GameState) => state.ui.craftingCollapsed
export const toggleCrafting = () =>
    useGameStore.setState((s) => ({
        ui: { ...s.ui, craftingCollapsed: !s.ui.craftingCollapsed },
    }))

export const woodCollapsed = (state: GameState) => state.ui.woodCollapsed
export const toggleWood = () =>
    useGameStore.setState((s) => ({
        ui: { ...s.ui, woodCollapsed: !s.ui.woodCollapsed },
    }))

export const miningCollapsed = (state: GameState) => state.ui.miningCollapsed
export const toggleMining = () =>
    useGameStore.setState((s) => ({
        ui: { ...s.ui, miningCollapsed: !s.ui.miningCollapsed },
    }))
