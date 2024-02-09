import { Icons } from '../icons/Icons'

export interface AddBattleLog {
    text: string
    iconId: Icons
    source?: string
}

export interface BattleLog {
    id: string
    text: string
    iconId: Icons
    date: number
}
