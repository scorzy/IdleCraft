import { Icons } from '../icons/Icons'
import { Msg } from '../msg/Msg'
import { GatheringZone } from './gatheringZones'
import { QuestState } from '../quests/QuestTypes'

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
export interface GatheringGroupZone {
    id: string
    nameId: keyof Msg
    iconId: Icons
    group: GatheringZone[]
}

export interface GatheringZoneConfig {
    iconId: Icons
    zone: GatheringZone
    nameId: keyof Msg
    unlocked: boolean
    requiredLevel: number
    unlockQuest?: QuestState
    gatheringTime: number
    expPerCycle: number
    guaranteedRarity: Rarity
    bonusRolls: RarityRoll[]
    resources: Resource[]
}

export type RandomFn = () => number
