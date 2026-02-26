import { GatheringZoneConfig, Rarity, Resource } from '../gatheringTypes'
import { gatherResources } from '../gatheringFunctions'
import { GatheringZone } from '../gatheringZones'

const forestResources: Resource[] = [
    { id: 'RedFlower', rarity: Rarity.Common },
    { id: 'BlueFlower', rarity: Rarity.Common },
    { id: 'GreenFlower', rarity: Rarity.Common },
    { id: 'VitalHerb', rarity: Rarity.Uncommon },
    { id: 'ManaBloom', rarity: Rarity.Uncommon },
    { id: 'StaminaLeaf', rarity: Rarity.Uncommon },
    { id: 'HealingFungus', rarity: Rarity.Rare },
    { id: 'ManaSpore', rarity: Rarity.Rare },
]

export const forestGatheringConfig: GatheringZoneConfig = {
    zone: GatheringZone.Forest,
    nameId: 'Forest',
    gatheringTime: 5000,
    expPerCycle: 10,
    guaranteedRarity: Rarity.Common,
    bonusRolls: [
        { rarity: Rarity.Common, chance: 75 },
        { rarity: Rarity.Uncommon, chance: 20 },
        { rarity: Rarity.Rare, chance: 5 },
    ],
    resources: forestResources,
}

export function gatherForest(random: () => number = Math.random): Resource[] {
    return gatherResources(forestGatheringConfig, random)
}
