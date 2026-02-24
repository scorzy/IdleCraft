import { ActivityState, ActivityTypes } from '../activities/ActivityState'
import { GatheringSubZone } from './gatheringZones'

export interface Gathering extends ActivityState {
    zone: GatheringSubZone
}

export function isGathering(act: ActivityState | Gathering): act is Gathering {
    return act.type === ActivityTypes.Gathering
}
