import { ActivityState, ActivityTypes } from '../activities/ActivityState'
import { GameLocations } from '../gameLocations/GameLocations'
import { WoodTypes } from './WoodTypes'

export interface IncreaseGrowSpeed extends ActivityState {
    woodType: WoodTypes
    location: GameLocations
}

export function isIncreaseGrowSpeed(act: ActivityState | IncreaseGrowSpeed): act is IncreaseGrowSpeed {
    return act.type === ActivityTypes.IncreaseGrowSpeed
}
