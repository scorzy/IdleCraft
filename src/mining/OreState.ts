import { OreTypes } from './OreTypes'

export interface OreState {
    qta: number
    hp: number
}
export type OreType = Partial<Record<OreTypes, OreState>>
