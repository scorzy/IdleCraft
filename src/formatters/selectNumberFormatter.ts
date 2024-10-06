import { default as microMemoize } from 'micro-memoize'
import { messages } from '../msg/allMsg'
import { useGameStore } from '../game/state'
import { GameState } from '../game/GameState'
import { getFormatter } from './formatNumber'
import { getTimeFormatter } from './formatTime'
import { NotationTypes } from './NotationTypes'
import { CommaTypes } from './CommaTypes'

const makeFormatter = microMemoize(
    (comma: CommaTypes, lang: string, notation: NotationTypes) => {
        const formatter = getFormatter(notation, comma)
        const t = messages[lang]
        if (!t) throw new Error(`Language ${lang} not found`)
        return {
            f: formatter[0],
            p: formatter[1],
            ft: getTimeFormatter(formatter[0], t.fun),
        }
    },
    {
        maxSize: 1,
    }
)

const makeFormatterFromUi = microMemoize(
    (comma: CommaTypes, lang: string, notation: NotationTypes) => {
        return makeFormatter(comma, lang, notation)
    },
    {
        maxSize: 1,
    }
)

const selectComma = (s: GameState) => s.ui.comma
const selectLang = (s: GameState) => s.ui.lang
const selectNotation = (s: GameState) => s.ui.numberFormatNotation

export const useNumberFormatter = () => {
    const comma = useGameStore(selectComma)
    const lang = useGameStore(selectLang)
    const notation = useGameStore(selectNotation)

    return makeFormatterFromUi(comma, lang, notation)
}
