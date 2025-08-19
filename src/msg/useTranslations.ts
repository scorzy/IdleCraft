import { createSelector } from 'reselect'
import { selectFormatter } from '../formatters/selectNumberFormatter'
import { useGameStore } from '../game/state'
import { selectLang } from '../ui/state/uiSelectors'
import { Translations } from './Msg'
import { messages } from './allMsg'

export const selectTranslations = createSelector(selectLang, selectFormatter, (lang, formatter): Translations => {
    const ret = messages[lang]
    if (!ret) throw new Error(`Language ${lang} not found`)
    return ret(formatter.f)
})

export const useTranslations = () => useGameStore(selectTranslations)
