import { GameState } from '../../game/GameState'

export const selectNotation = (state: GameState) => state.ui.numberFormatNotation
export const selectComma = (state: GameState) => state.ui.comma
export const selectLang = (state: GameState) => state.ui.lang
