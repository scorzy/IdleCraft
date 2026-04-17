import { ActivityState, ActivityTypes } from '../activities/ActivityState'
import { GatheringZone } from './gatheringZones'

export interface Gathering extends ActivityState {
    zone: GatheringZone
}

export function isGathering(act: ActivityState | Gathering): act is Gathering {
    return act.type === ActivityTypes.Gathering
}
