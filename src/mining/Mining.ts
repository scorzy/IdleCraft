import { ActivityState, ActivityTypes } from '../activities/ActivityState'
import { OreTypes } from './OreTypes'

export interface Mining extends ActivityState {
    oreType: OreTypes
    isMining: boolean
}
export function isMining(act: ActivityState | Mining): act is Mining {
    return act.type === ActivityTypes.Mining
}
