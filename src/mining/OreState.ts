import { OreTypes } from './OreTypes'

export interface OreState {
    qta: number
    hp: number
}

export interface OreVeinState {
    id: string
    oreType: OreTypes
    qta: number
    maxQta: number
    hp: number
    maxHp: number
    armour: number
    gemChance: number
}

export type OreType = Partial<Record<OreTypes, OreState>>
