import { GameLocations } from '../gameLocations/GameLocations'
import { Icons } from '../icons/Icons'
import { Msg } from '../msg/Msg'
import { GatheringZoneUnlockQuestData } from './functions/MakeGatheringZoneUnlockQuestData'
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
export interface GatheringGroupZone {
    id: string
    nameId: keyof Msg
    iconId: Icons
    group: GatheringZone[]
}

export interface GatheringZoneConfig {
    iconId: Icons
    locations?: GameLocations
    zone: GatheringZone
    nameId: keyof Msg
    gatheringTime: number
    expPerCycle: number
    guaranteedRarity: Rarity
    bonusRolls: RarityRoll[]
    resources: Resource[]
    unlockData?: {
        requiredLevel: number
        questData?: GatheringZoneUnlockQuestData
    }
}

export type RandomFn = () => number
