import { createSelector } from 'reselect'
import { messages } from '../msg/allMsg'
import { useGameStore } from '../game/state'
import { GameState } from '../game/GameState'
import { getFormatter } from './formatNumber'

export const selectFormatter = createSelector(
    [(s: GameState) => s.ui.numberFormatNotation, (s: GameState) => s.ui.comma, (s: GameState) => s.ui.lang],
    (numberFormatNotation, comma, lang) => {
        const formatter = getFormatter(numberFormatNotation, comma)
        const t = messages[lang]
        if (!t) throw new Error(`Language ${lang} not found`)
        return {
            f: formatter[0],
            p: formatter[1],
        }
    }
)

export const useNumberFormatter = () => useGameStore(selectFormatter)
