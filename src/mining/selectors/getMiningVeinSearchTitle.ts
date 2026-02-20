import { GameState } from '../../game/GameState'
import { selectTranslations } from '../../msg/useTranslations'

export function getMiningVeinSearchTitle(state: GameState, _id: string) {
    return selectTranslations(state).t.SearchOreVein
}
