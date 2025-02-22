import { ActivityState, ActivityTypes } from '../activities/ActivityState'
import { WoodTypes } from './WoodTypes'

export interface Woodcutting extends ActivityState {
    woodType: WoodTypes
}
export function isWoodcutting(act: ActivityState | Woodcutting): act is Woodcutting {
    return act.type === ActivityTypes.Woodcutting
}
