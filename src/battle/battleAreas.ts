import { Icons } from '../icons/Icons'
import { Msg } from '../msg/Msg'
import { CollapsedEnum } from '../ui/sidebar/CollapsedEnum'
import { BattleZoneEnum } from './BattleZoneEnum'

export interface BattleAreas {
    id: string
    nameId: keyof Msg
    iconId: Icons
    zones: BattleZoneEnum[]
    collapsedId: CollapsedEnum
}
export const BattleAreasList: BattleAreas[] = [
    {
        id: 'forest',
        nameId: 'Forest',
        iconId: Icons.Forest,
        collapsedId: CollapsedEnum.Forest,
        zones: [BattleZoneEnum.Boar, BattleZoneEnum.Wolf],
    },
]
