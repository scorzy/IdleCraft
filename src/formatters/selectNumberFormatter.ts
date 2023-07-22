import { getFormatter } from './formatNumber'
import { getTimeFormatter } from './formatTime'
import { messages } from '../msg/allMsg'
import { useGameStore } from '../game/state'
import { useMemo } from 'react'
import { selectNotation, selectComma, selectLang } from '../ui/state/uiSelectors'

export const useNumberFormatter = () => {
    const notation = useGameStore(selectNotation)
    const comma = useGameStore(selectComma)
    const lang = useGameStore(selectLang)

    return useMemo(() => {
        const formatter = getFormatter(notation, comma)
        const t = messages[lang]
        return {
            f: formatter[0],
            p: formatter[1],
            ft: getTimeFormatter(formatter[0], t),
        }
    }, [comma, lang, notation])
}
