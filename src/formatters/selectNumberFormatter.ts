import { getFormatter } from './formatNumber'
import { getTimeFormatter } from './formatTime'
import { messages } from '../msg/allMsg'
import { useGameStore } from '../game/state'
import { selectNotation, selectComma, selectLang } from '../ui/state/uiSelectors'
import { NotationTypes } from './NotationTypes'
import { CommaTypes } from './CommaTypes'
import { memoizeOne } from '../utils/memoizeOne'

const makeFormatter = memoizeOne((comma: CommaTypes, lang: string, notation: NotationTypes) => {
    const formatter = getFormatter(notation, comma)
    const t = messages[lang]
    return {
        f: formatter[0],
        p: formatter[1],
        ft: getTimeFormatter(formatter[0], t),
    }
})

export const useNumberFormatter = () => {
    const comma = useGameStore(selectComma)
    const lang = useGameStore(selectLang)
    const notation = useGameStore(selectNotation)

    return makeFormatter(comma, lang, notation)
}
