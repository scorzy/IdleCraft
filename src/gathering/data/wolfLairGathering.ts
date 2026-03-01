import { GatheringZoneConfig, Rarity, Resource } from '../gatheringTypes'
import { GatheringZone } from '../gatheringZones'
import { Icons } from '../../icons/Icons'

const wolfLairGatheringResources: Resource[] = [
    { id: 'RedFlower', rarity: Rarity.Common },
    { id: 'BlueFlower', rarity: Rarity.Common },
    { id: 'GreenFlower', rarity: Rarity.Common },
    { id: 'VitalHerb', rarity: Rarity.Uncommon },
    { id: 'ManaBloom', rarity: Rarity.Uncommon },
    { id: 'StaminaLeaf', rarity: Rarity.Uncommon },
    { id: 'HealingFungus', rarity: Rarity.Rare },
    { id: 'ManaSpore', rarity: Rarity.Rare },
]

export const wolfLairGatheringConfig: GatheringZoneConfig = {
    zone: GatheringZone.WolfLair,
    nameId: 'WolfLair',
    unlocked: false,
    requiredLevel: 0,
    iconId: Icons.WolfHead,
    gatheringTime: 5000,
    expPerCycle: 10,
    guaranteedRarity: Rarity.Common,
    bonusRolls: [
        { rarity: Rarity.Common, chance: 60 },
        { rarity: Rarity.Uncommon, chance: 30 },
        { rarity: Rarity.Rare, chance: 10 },
    ],
    resources: wolfLairGatheringResources,
}
