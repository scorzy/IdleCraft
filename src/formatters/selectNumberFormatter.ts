import { memoize } from 'micro-memoize'
import { GameState } from '../game/GameState'
import { useGameStore } from '../game/state'
import { messages } from '../msg/allMsg'
import { CommaTypes } from './CommaTypes'
import { getFormatter } from './formatNumber'
import { NotationTypes } from './NotationTypes'

const createFormatter = memoize((numberFormatNotation: NotationTypes, comma: CommaTypes, lang: string) => {
    const formatter = getFormatter(numberFormatNotation, comma)
    const t = messages[lang]
    if (!t) throw new Error(`Language ${lang} not found`)
    return {
        f: formatter[0],
        p: formatter[1],
    }
})

export const selectFormatter = (s: GameState) => {
    const numberFormatNotation = s.ui.numberFormatNotation
    const comma = s.ui.comma
    const lang = s.ui.lang

    return createFormatter(numberFormatNotation, comma, lang)
}

export const useNumberFormatter = () => useGameStore(selectFormatter)
