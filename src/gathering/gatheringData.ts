import { Icons } from '../icons/Icons'
import { forestGatheringConfig } from './data/forestGathering'
import { wolfLairGatheringConfig } from './data/wolfLairGathering'
import { GatheringGroupZone, GatheringZoneConfig } from './gatheringTypes'
import { GatheringZone } from './gatheringZones'

export const GatheringData: Record<GatheringZone, GatheringZoneConfig> = {
    [GatheringZone.Forest]: forestGatheringConfig,
    [GatheringZone.WolfLair]: wolfLairGatheringConfig,
}

export const GatheringZoneGroups: GatheringGroupZone[] = [
    {
        id: 'Forest',
        nameId: 'Forest',
        iconId: Icons.Forest,
        group: [GatheringZone.Forest, GatheringZone.WolfLair],
    },
]
