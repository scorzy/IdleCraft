import { GameState } from '../../game/GameState'
import { OreData } from '../OreData'
import { getMiningActivity } from '../selectors/getMiningActivity'

export function getMiningIcon(state: GameState, id: string) {
    const activity = getMiningActivity(state.activities, id)
    return OreData[activity.oreType].iconId
}
