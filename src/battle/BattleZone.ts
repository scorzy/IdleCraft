import { CharTemplateEnum } from '../characters/templates/characterTemplateEnum'

export interface BattleZone {
    enemies: {
        quantity: number
        template: CharTemplateEnum
    }[]
}
