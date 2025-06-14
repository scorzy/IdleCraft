import { CharTemplateEnum } from '../characters/templates/characterTemplateEnum'
import { Icons } from '../icons/Icons'
import { Msg } from '../msg/Msg'

export interface BattleZone {
    nameId: keyof Msg
    iconId: Icons
    enemies: {
        id: string
        quantity: number
        template: CharTemplateEnum
    }[]
}
