import { ReactNode } from 'react'
import { ExpEnum } from '../experience/expEnum'
import { Msg } from '../msg/Msg'
import { PerksEnum } from './perksEnum'
import { GiMining, GiWoodAxe } from 'react-icons/gi'

export interface ExpReq {
    skill: ExpEnum
    level: number
}
export interface Perk {
    id: PerksEnum
    icon: ReactNode
    nameId: keyof Msg
    descId: keyof Msg
    requiredExp?: Array<ExpReq>
    requiredPerks?: PerksEnum[]
    max?: number
}
export const PerksData: { [k in PerksEnum]: Perk } = {
    [PerksEnum.FAST_WOODCUTTING]: {
        id: PerksEnum.FAST_WOODCUTTING,
        icon: <GiWoodAxe />,
        nameId: 'FastWoodcuttingPerk',
        descId: 'FastWoodcuttingPerkDesc',
    },
    [PerksEnum.FAST_MINING]: {
        id: PerksEnum.FAST_MINING,
        icon: <GiMining />,
        nameId: 'FastWoodcuttingPerk',
        descId: 'FastWoodcuttingPerkDesc',
        requiredExp: [{ level: 60, skill: ExpEnum.Mining }],
        requiredPerks: [PerksEnum.FAST_WOODCUTTING],
    },
}
