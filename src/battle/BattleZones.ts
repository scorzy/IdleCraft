import { CharTemplateEnum } from '../characters/templates/characterTemplateEnum'
import { Icons } from '../icons/Icons'
import { BattleZone } from './BattleZone'
import { BattleZoneEnum } from './BattleZoneEnum'

export const BattleZones: { [k in BattleZoneEnum]: BattleZone } = {
    [BattleZoneEnum.Boar]: {
        nameId: 'Boar',
        iconId: Icons.Boar,
        enemies: [
            {
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
                quantity: 2,
                template: CharTemplateEnum.Wolf,
            },
        ],
    },
}
