import { ActivityState } from '../activities/ActivityState'
import { WoodTypes } from './WoodTypes'

export interface Woodcutting extends ActivityState {
    activityId: string
    woodType: WoodTypes
}
export function isWoodcutting(act: ActivityState | Woodcutting): act is Woodcutting {
    return (act as Woodcutting).woodType !== undefined
}
