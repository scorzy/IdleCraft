import { Icons } from '../icons/Icons'
import { Msg } from '../msg/Msg'
import { PerksEnum } from '../perks/perksEnum'

export interface BaseBonus {
    nameId: keyof Msg
    iconId: Icons
}
export interface Bonus {
    id: string
    baseBonus?: BaseBonus | null
    stdItemId?: string | null
    craftItemId?: string | null
    perk?: PerksEnum
    add?: number
    multi?: number
    showQta?: number
}
export interface BonusResult {
    total: number
    bonuses: Bonus[]
}
