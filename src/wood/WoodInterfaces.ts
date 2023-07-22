import { WoodTypes } from './WoodTypes'

export interface ForestsState {
    qta: number
    hp: number
}
export type ForestsType = { [k in WoodTypes]?: ForestsState }
export interface Woodcutting {
    activityId: string
    woodType: WoodTypes
}
