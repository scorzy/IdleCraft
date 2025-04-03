import { GameState } from '../../game/GameState'
import { selectTranslations } from '../../msg/useTranslations'
import { OreData } from '../OreData'
import { getMiningActivity } from '../selectors/getMiningActivity'

export function getMiningTitle(state: GameState, id: string) {
    const activity = getMiningActivity(state.activities, id)
    const t = selectTranslations(state)
    return t.fun.mining(OreData[activity.oreType].nameId)
}
