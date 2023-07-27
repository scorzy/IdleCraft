import { WoodTypes } from './WoodTypes'

export interface ForestsState {
    qta: number
    hp: number
}

export type ForestsType = { [k in WoodTypes]?: ForestsState }
