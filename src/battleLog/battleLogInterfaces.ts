import { Icons } from '../icons/Icons'
import { Msg } from '../msg/Msg'

export interface AddBattleLog {
    text?: keyof Msg
    iconId: Icons
    abilityId?: keyof Msg
    source?: string
    targets?: string
    damageDone?: number
}

export interface BattleLog {
    id: string
    text?: keyof Msg
    iconId: Icons
    date: number
    abilityId?: keyof Msg
    source?: string
    targets?: string
    damageDone?: number
}
