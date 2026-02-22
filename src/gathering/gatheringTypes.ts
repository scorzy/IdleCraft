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

export type RandomFn = () => number
