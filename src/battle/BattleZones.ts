import { CharTemplateEnum } from '../characters/templates/characterTemplateEnum'
import { Icons } from '../icons/Icons'
import { BattleZone } from './BattleZone'
import { BattleZoneEnum } from './BattleZoneEnum'

export const BattleZones: Record<BattleZoneEnum, BattleZone> = {
    [BattleZoneEnum.Chicken]: {
        nameId: 'Chicken',
        iconId: Icons.Chicken,
        enemies: [
            {
                id: 'Chicken',
                quantity: 1,
                template: CharTemplateEnum.Chicken,
            },
        ],
    },
    [BattleZoneEnum.Boar]: {
        nameId: 'Boar',
        iconId: Icons.Boar,
        enemies: [
            {
                id: 'boar-2',
                quantity: 2,
                template: CharTemplateEnum.Boar,
            },
        ],
    },
    [BattleZoneEnum.Wolf]: {
        nameId: 'Wolves',
        iconId: Icons.WolfHead,
        enemies: [
            {
                id: 'wolf-3',
                quantity: 3,
                template: CharTemplateEnum.Wolf,
            },
        ],
    },
}
