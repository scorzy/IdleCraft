import { Item } from '../items/Item'
import { GatheringZone } from './gatheringZones'
import { forestGatheringConfig } from './forestGathering'
import { GatheringZoneConfig, Rarity } from './gatheringTypes'

export interface GatheringZoneData {
    zone: GatheringZone
    nameId: 'Forest'
    gatheringTime: number
    expPerCycle: number
    config: GatheringZoneConfig
}

export const GatheringData: Record<GatheringZone, GatheringZoneData> = {
    [GatheringZone.Forest]: {
        zone: GatheringZone.Forest,
        nameId: 'Forest',
        gatheringTime: 3000,
        expPerCycle: 10,
        config: forestGatheringConfig,
    },
}

export const RarityLabel: Record<Rarity, string> = {
    [Rarity.Common]: 'Common',
    [Rarity.Uncommon]: 'Uncommon',
    [Rarity.Rare]: 'Rare',
}

export function selectZoneLootTable(zone: GatheringZone): { rarity: Rarity; items: Item['id'][] }[] {
    const resources = GatheringData[zone].config.resources
    return [Rarity.Common, Rarity.Uncommon, Rarity.Rare].map((rarity) => ({
        rarity,
        items: resources.filter((resource) => resource.rarity === rarity).map((resource) => resource.id),
    }))
}
