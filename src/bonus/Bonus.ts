import { Icons } from '../icons/Icons'
import { Msg } from '../msg/Msg'

export interface BaseBonus {
    nameId: keyof Msg
    iconId: Icons
}
export interface Bonus {
    id: string
    nameId: keyof Msg
    iconId: Icons
    add?: number
    multi?: number
    showQta?: number
}
export interface BonusResult {
    total: number
    bonuses: Bonus[]
}
