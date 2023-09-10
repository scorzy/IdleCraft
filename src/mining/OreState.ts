import { OreTypes } from './OreTypes'

export interface OreState {
    qta: number
    hp: number
}
export type OreType = { [k in OreTypes]?: OreState }
