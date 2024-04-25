import { messages } from '../msg/allMsg'
import { useGameStore } from '../game/state'
import { selectUi } from '../ui/state/uiSelectors'
import { memoizeOne } from '../utils/memoizeOne'
import { getFormatter } from './formatNumber'
import { getTimeFormatter } from './formatTime'
import { NotationTypes } from './NotationTypes'
import { CommaTypes } from './CommaTypes'
import { UiState } from '@/ui/UiState'

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

const makeFormatterFromUi = memoizeOne((ui: UiState) => {
    const comma = ui.comma
    const lang = ui.lang
    const notation = ui.numberFormatNotation

    return makeFormatter(comma, lang, notation)
})

export const useNumberFormatter = () => {
    const ui = useGameStore(selectUi)
    return makeFormatterFromUi(ui)
}
