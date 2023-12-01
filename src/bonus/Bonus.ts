import { Icons } from '../icons/Icons'
import { Msg } from '../msg/Msg'
import { PerksEnum } from '../perks/perksEnum'
export interface BaseBonus {
    nameId: keyof Msg
    iconId: Icons
}
export interface Bonus {
    id: string
    baseBonus?: BaseBonus
    stdItem?: string
    craftItem?: string
    perk?: PerksEnum
    add?: number
    multi?: number
}
export interface BonusResult {
    total: number
    bonuses: Bonus[]
}
