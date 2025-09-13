import moize from 'moize'
import { selectFormatter } from '../formatters/selectNumberFormatter'
import { GameState } from '../game/GameState'
import { useGameStore } from '../game/state'
import { selectLang } from '../ui/state/uiSelectors'
import { messages } from './allMsg'

const makeTranslations = moize((lang: string, f: (value: number) => string) => {
    const ret = messages[lang]
    if (!ret) throw new Error(`Language ${lang} not found`)
    return ret(f)
})

export const selectTranslations = (s: GameState) => {
    const lang = selectLang(s)
    const formatter = selectFormatter(s)

    return makeTranslations(lang, formatter.f)
}

export const useTranslations = () => useGameStore(selectTranslations)
