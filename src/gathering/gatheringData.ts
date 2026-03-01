import { Icons } from '../icons/Icons'
import { GatheringZone } from './gatheringZones'
import { forestGatheringConfig } from './data/forestGathering'
import { GatheringGroupZone, GatheringZoneConfig, Rarity } from './gatheringTypes'
import { wolfLairGatheringConfig } from './data/wolfLairGathering'

export const GatheringData: Record<GatheringZone, GatheringZoneConfig> = {
    [GatheringZone.Forest]: forestGatheringConfig,
    [GatheringZone.WolfLair]: wolfLairGatheringConfig,
}

export const RarityLabel: Record<Rarity, string> = {
    [Rarity.Common]: 'Common',
    [Rarity.Uncommon]: 'Uncommon',
    [Rarity.Rare]: 'Rare',
}

export const GatheringZoneGroups: GatheringGroupZone[] = [
    {
        id: 'Forest',
        nameId: 'Forest',
        iconId: Icons.Forest,
        group: [GatheringZone.Forest, GatheringZone.WolfLair],
    },
]
