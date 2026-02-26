import { memoize } from 'micro-memoize'
import { Item } from '../../items/Item'
import { GatheringData } from '../gatheringData'
import { Rarity } from '../gatheringTypes'
import { GatheringZone } from '../gatheringZones'

export const selectZoneLootTable = memoize((zone: GatheringZone): { rarity: Rarity; items: Item['id'][] }[] => {
    const resources = GatheringData[zone].resources
    return [Rarity.Common, Rarity.Uncommon, Rarity.Rare].map((rarity) => ({
        rarity,
        items: resources.filter((resource) => resource.rarity === rarity).map((resource) => resource.id),
    }))
})
