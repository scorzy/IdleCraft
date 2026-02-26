import { Msg } from '../msg/Msg'
import { GatheringZone } from './gatheringZones'
import { forestGatheringConfig } from './data/forestGathering'
import { GatheringZoneConfig, Rarity } from './gatheringTypes'

export const GatheringData: Record<GatheringZone, GatheringZoneConfig> = {
    [GatheringZone.Forest]: forestGatheringConfig,
}

export const RarityLabel: Record<Rarity, string> = {
    [Rarity.Common]: 'Common',
    [Rarity.Uncommon]: 'Uncommon',
    [Rarity.Rare]: 'Rare',
}

export interface GatheringGroupZone {
    id: string
    nameId: keyof Msg
    zone: GatheringZone
    group: string
}
