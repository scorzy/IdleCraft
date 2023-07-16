import { useGameState } from '../game/gameStore'
import { messages } from './allMsg'

export const useTranslations = () => {
    const lang = useGameState((s) => s.lang)
    return messages[lang]
}
