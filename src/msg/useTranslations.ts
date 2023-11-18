import { GameState } from '../game/GameState'
import { useGameStore } from '../game/state'
import { selectLang } from '../ui/state/uiSelectors'
import { Translations } from './Msg'
import { messages } from './allMsg'

export const selectTranslations: (state: GameState) => Translations = (state: GameState) => {
    const lang = selectLang(state)
    const ret = messages[lang]
    if (!ret) throw new Error(`Language ${lang} not found`)
    return ret
}

export const useTranslations = () => {
    const lang = useGameStore(selectLang)
    const ret = messages[lang]
    if (!ret) throw new Error(`Language ${lang} not found`)
    return ret
}
