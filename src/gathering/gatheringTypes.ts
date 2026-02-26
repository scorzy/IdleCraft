import { Msg } from '../msg/Msg'
import { GatheringZone } from './gatheringZones'

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
    zone: GatheringZone
    nameId: keyof Msg
    gatheringTime: number
    expPerCycle: number
    guaranteedRarity: Rarity
    bonusRolls: RarityRoll[]
    resources: Resource[]
}

export type RandomFn = () => number
