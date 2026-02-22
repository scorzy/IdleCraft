import { ReactNode } from 'react'
import { TbLock } from 'react-icons/tb'
import { setState } from '../../game/setState'
import { WoodTypes } from '../../wood/WoodTypes'
import { GameState } from '../../game/GameState'
import { OreTypes } from '../../mining/OreTypes'
import { changeRecipeState } from '../../crafting/RecipeFunctions'
import { CollapsedEnum } from '../sidebar/CollapsedEnum'
import { GatheringZone } from '../../gathering/gatheringZones'
import { UiPagesData } from './UiPagesData'
import { UiPages } from './UiPages'
import { useUiTempStore } from './uiTempStore'

export type Colors = 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'health' | 'stamina' | 'mana'
type StorageOrder = 'name' | 'quantity' | 'value'

export const setTheme = (theme: string) =>
    setState((s) => {
        s.ui.theme = theme
    })
export const setThemeColor = (themeColor: string) =>
    setState((s) => {
        s.ui.themeColor = themeColor
    })
export const sidebarOpen = (s: GameState) => s.ui.open
export const toggle = () =>
    setState((s) => {
        s.ui.open = !s.ui.open
    })
export const setPage = (page: UiPages) =>
    setState((s) => {
        const data = UiPagesData[page]

        if (s.ui.recipeType !== data.recipeType) changeRecipeState(s, '')

        s.ui.page = page
        s.ui.open = false
        s.ui.recipeType = data.recipeType
    })
export const setWood = (woodType: WoodTypes) =>
    setState((s) => {
        s.ui.woodType = woodType
    })
export const setOre = (oreType: OreTypes) =>
    setState((s) => {
        s.ui.oreType = oreType
    })

export const setGatheringZone = (gatheringZone: GatheringZone) =>
    setState((s) => {
        s.ui.gatheringZone = gatheringZone
    })

export const setStorageOrder = (order: StorageOrder, asc: boolean) => () =>
    setState((s) => {
        s.ui.storageOrder = order
        s.ui.storageAsc = asc
    })

export const clickStorageHeader = (order: StorageOrder) => () =>
    setState((s: GameState) => {
        let storageAsc = s.ui.storageAsc
        if (s.ui.storageOrder === order) storageAsc = !s.ui.storageAsc

        s.ui.storageOrder = order
        s.ui.storageAsc = storageAsc
    })

export const toggleShowAvailablePerks = () =>
    setState((s) => {
        s.ui.showAvailablePerks = !s.ui.showAvailablePerks
    })

export const toggleShowUnavailablePerks = () =>
    setState((s) => {
        s.ui.showUnavailablePerks = !s.ui.showUnavailablePerks
    })

export const toggleCompletedPerks = () =>
    setState((s) => {
        s.ui.showOwnedPerks = !s.ui.showOwnedPerks
    })

export const setSelectedChar = (selectedCharId: string) =>
    setState((s) => {
        s.ui.selectedCharId = selectedCharId
    })

export const collapse = (id: CollapsedEnum) => setState(collapseInt(id))

export const collapseInt = (id: CollapsedEnum) => (s: GameState) => {
    if (id in s.ui.collapsed) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete s.ui.collapsed[id]
    } else s.ui.collapsed[id] = true
}
export const setCollapseInt = (id: CollapsedEnum, open: boolean) => (s: GameState) => {
    if (open === (s.ui.collapsed[id] ?? false)) return

    collapseInt(id)(s)
}
export const lockedIcon = (icon: ReactNode, enabled: boolean) => (enabled ? icon : <TbLock />)

export const setSidebarWidth = (id: CollapsedEnum, width: number) =>
    useUiTempStore.setState((s) => ({
        sidebarWidths: { ...s.sidebarWidths, [id]: width },
    }))
