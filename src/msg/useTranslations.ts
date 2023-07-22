import { useGameStore } from '../game/state'
import { selectLang } from '../ui/state/uiSelectors'
import { messages } from './allMsg'

export const useTranslations = () => {
    const lang = useGameStore(selectLang)
    return messages[lang]
}
