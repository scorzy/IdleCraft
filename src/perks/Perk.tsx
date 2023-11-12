import { ReactNode } from 'react'
import { ExpEnum } from '../experience/expEnum'
import { Msg } from '../msg/Msg'
import { PerksEnum } from './perksEnum'
import { GiMining, GiP90, GiWoodAxe } from 'react-icons/gi'

export interface Perk {
    id: PerksEnum
    icon: ReactNode
    nameId: keyof Msg
    descId: keyof Msg
    requiredExp?: Array<{ skill: ExpEnum; level: number }>
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
    },
}
