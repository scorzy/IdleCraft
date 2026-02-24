import { Requirement } from '../requirements/RequirementTypes'

export enum Rarity {
    Common = 'Common',
    Uncommon = 'Uncommon',
    Rare = 'Rare',
}

export interface Resource {
    id: string
    rarity: Rarity
}

export interface RarityRoll {
    rarity: Rarity
    chance: number
}

export interface GatheringZoneConfig {
    guaranteedRarity: Rarity
    bonusRolls: RarityRoll[]
    resources: Resource[]
}

export interface ZoneImprovementConfig {
    id: string
    name: string
    description: string
    requirements: Requirement[]
    rewardZoneExp: number
}

export type RandomFn = () => number
