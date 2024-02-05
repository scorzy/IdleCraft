import { GameState } from '../../game/GameState'
import { WoodTypes } from '../../wood/WoodTypes'
import { CollapsedEnum } from '../sidebar/CollapsedEnum'

export const selectTheme = (state: GameState) => state.ui.theme
export const selectThemeColor = (state: GameState) => state.ui.themeColor
export const selectNotation = (state: GameState) => state.ui.numberFormatNotation
export const selectComma = (state: GameState) => state.ui.comma
export const selectLang = (state: GameState) => state.ui.lang
export const isWoodSelected = (woodType: WoodTypes) => (state: GameState) => state.ui.woodType === woodType
export const selectWoodType = (state: GameState) => state.ui.woodType
export const selectOreType = (state: GameState) => state.ui.oreType

export const selectShowAvailablePerks = (state: GameState) => state.ui.showAvailablePerks
export const selectShowUnavailablePerks = (state: GameState) => state.ui.showUnavailablePerks
export const selectCompletedPerks = (state: GameState) => state.ui.showOwnedPerks
export const selectSelectedCharId = (state: GameState) => state.ui.selectedCharId
export const isCharSelected = (charId: string) => (state: GameState) => state.ui.selectedCharId === charId
export const isCollapsed = (id: CollapsedEnum) => (state: GameState) => state.ui.collapsed[id] ?? false

export const selectStorageOrder = (s: GameState) => s.ui.storageOrder
export const selectStorageAsc = (s: GameState) => s.ui.storageAsc

export const selectIsStorageOrderName = (s: GameState) => s.ui.storageOrder === 'name'
export const selectIsStorageOrderQuantity = (s: GameState) => s.ui.storageOrder === 'quantity'
export const selectIsStorageOrderValue = (s: GameState) => s.ui.storageOrder === 'value'
