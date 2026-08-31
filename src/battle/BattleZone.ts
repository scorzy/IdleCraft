import { CharacterId } from '../characters/templates/characterRegistry'
import { Icons } from '../icons/Icons'
import { Msg } from '../msg/Msg'

export interface BattleZoneEnemy {
    id: string
    quantity: number
    template: CharacterId
}

export interface BattleZone {
    nameId: keyof Msg
    iconId: Icons
    enemies: BattleZoneEnemy[]
}
