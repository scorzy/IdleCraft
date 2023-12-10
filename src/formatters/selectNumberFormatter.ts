import { messages } from '../msg/allMsg'
import { useGameStore } from '../game/state'
import { selectNotation, selectComma, selectLang } from '../ui/state/uiSelectors'
import { memoizeOne } from '../utils/memoizeOne'
import { getFormatter } from './formatNumber'
import { getTimeFormatter } from './formatTime'
import { NotationTypes } from './NotationTypes'
import { CommaTypes } from './CommaTypes'

const makeFormatter = memoizeOne((comma: CommaTypes, lang: string, notation: NotationTypes) => {
    const formatter = getFormatter(notation, comma)
    const t = messages[lang]
    if (!t) throw new Error(`Language ${lang} not found`)
    return {
        f: formatter[0],
        p: formatter[1],
        ft: getTimeFormatter(formatter[0], t.fun),
    }
})

export const useNumberFormatter = () => {
    const comma = useGameStore(selectComma)
    const lang = useGameStore(selectLang)
    const notation = useGameStore(selectNotation)

    return makeFormatter(comma, lang, notation)
}
