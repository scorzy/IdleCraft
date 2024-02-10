import { Icons } from '../icons/Icons'
import { Msg } from '../msg/Msg'

export interface AddBattleLog {
    text?: string
    iconId: Icons
    abilityId: keyof Msg
    source?: string
    targets?: string
}

export interface BattleLog {
    id: string
    text?: string
    iconId: Icons
    date: number
    abilityId: keyof Msg
    source?: string
    targets?: string
}
