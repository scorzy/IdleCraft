import { memoize } from 'proxy-memoize'
import { messages } from '../msg/allMsg'
import { useGameStore } from '../game/state'
import { UiState } from '../ui/UiState'
import { GameState } from '../game/GameState'
import { getFormatter } from './formatNumber'
import { getTimeFormatter, getTimeFormatterPrecise } from './formatTime'

const makeFormatter = memoize((ui: UiState) => {
    const formatter = getFormatter(ui.numberFormatNotation, ui.comma)
    const t = messages[ui.lang]
    if (!t) throw new Error(`Language ${ui.lang} not found`)
    return {
        f: formatter[0],
        p: formatter[1],
        ft: getTimeFormatter(formatter[0], t.fun),
        ftp: getTimeFormatterPrecise(formatter[0], t.fun),
    }
})

const selectFormatter = (s: GameState) => makeFormatter(s.ui)

export const useNumberFormatter = () => useGameStore(selectFormatter)
