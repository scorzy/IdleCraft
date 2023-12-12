import { ExpEnum } from '../experience/expEnum'
import { Msg } from '../msg/Msg'
import { Icons } from '../icons/Icons'
import { PerksEnum } from './perksEnum'

export interface ExpReq {
    skill: ExpEnum
    level: number
}
export interface Perk {
    id: PerksEnum
    iconId: Icons
    nameId: keyof Msg
    descId: keyof Msg
    requiredExp?: Array<ExpReq>
    requiredPerks?: PerksEnum[]
    max?: number
}
export const PerksData: { [k in PerksEnum]: Perk } = {
    [PerksEnum.FAST_WOODCUTTING]: {
        id: PerksEnum.FAST_WOODCUTTING,
        iconId: Icons.Axe,
        nameId: 'FastWoodcuttingPerk',
        descId: 'FastWoodcuttingPerkDesc',
    },
    [PerksEnum.FAST_MINING]: {
        id: PerksEnum.FAST_MINING,
        iconId: Icons.Pickaxe,
        nameId: 'FastMiningPerk',
        descId: 'FastMiningPerkDesc',
    },
}
