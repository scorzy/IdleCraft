import { Icons } from '../icons/Icons'
import { Msg } from '../msg/Msg'
import { BattleZoneEnum } from './BattleZoneEnum'

export interface BattleAreas {
    id: string
    nameId: keyof Msg
    iconId: Icons
    zones: BattleZoneEnum[]
}
export const BattleAreasList: BattleAreas[] = [
    {
        id: 'forest',
        nameId: 'Forest',
        iconId: Icons.Axe,
        zones: [BattleZoneEnum.Boar],
    },
]
