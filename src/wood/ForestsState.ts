import { WoodTypes } from './WoodTypes'

export interface ForestsState {
    qta: number
    hp: number
}

export type ForestsType = Partial<Record<WoodTypes, ForestsState>>
