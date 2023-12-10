import { GameState } from '../../game/GameState'
import { WoodTypes } from '../../wood/WoodTypes'

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
