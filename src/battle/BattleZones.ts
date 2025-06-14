import { CharTemplateEnum } from '../characters/templates/characterTemplateEnum'
import { Icons } from '../icons/Icons'
import { BattleZone } from './BattleZone'
import { BattleZoneEnum } from './BattleZoneEnum'

export const BattleZones: Record<BattleZoneEnum, BattleZone> = {
    [BattleZoneEnum.Boar]: {
        nameId: 'Boar',
        iconId: Icons.Boar,
        enemies: [
            {
                id: 'boar-1',
                quantity: 1,
                template: CharTemplateEnum.Boar,
            },
        ],
    },
    [BattleZoneEnum.Wolf]: {
        nameId: 'Wolves',
        iconId: Icons.WolfHead,
        enemies: [
            {
                id: 'wolf-1',
                quantity: 2,
                template: CharTemplateEnum.Wolf,
            },
        ],
    },
}
