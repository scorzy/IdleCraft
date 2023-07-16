import { createSelector } from 'reselect'
import { getFormatter } from './formatNumber'
import { getTimeFormatter } from './formatTime'
import { GameState } from '../game/GameState'
import { useGameState } from '../game/gameStore'
import { messages } from '../msg/allMsg'

export const selectNumberFormatter = createSelector(
    (state: GameState) => state.numberFormatNotation,
    (state: GameState) => state.comma,
    (state: GameState) => state.lang,
    (notation, comma, lang) => {
        const formatter = getFormatter(notation, comma)
        const t = messages[lang]
        return {
            f: formatter[0],
            p: formatter[1],
            ft: getTimeFormatter(formatter[0], t),
        }
    }
)

export const useNumberFormatter = () => {
    const formatter = useGameState((state) => selectNumberFormatter(state))
    return formatter
}
