import { GameState } from '../game/GameState'
import { useGameStore } from '../game/state'
import { selectLang } from '../ui/state/uiSelectors'
import { messages } from './allMsg'

export const selectTranslations = (state: GameState) => {
    const lang = selectLang(state)
    return messages[lang]
}

export const useTranslations = () => {
    const lang = useGameStore(selectLang)
    return messages[lang]
}
