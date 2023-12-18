import { CharTemplateEnum } from '../characters/templates/characterTemplateEnum'
import { BattleZone } from './BattleZone'
import { BattleZoneEnum } from './BattleZoneEnum'

// eslint-disable-next-line import/no-unused-modules
export const BattleZones: { [k in BattleZoneEnum]: BattleZone } = {
    [BattleZoneEnum.Boar]: {
        enemies: [
            {
                quantity: 1,
                template: CharTemplateEnum.Boar,
            },
        ],
    },
}
