import { Icons } from '../../icons/Icons'
import { CharTemplate } from './charTemplates'
import { CharTemplateEnum } from './characterTemplateEnum'

export const CharTemplatesData: { [k in CharTemplateEnum]: CharTemplate } = {
    [CharTemplateEnum.Boar]: {
        nameId: 'Boar',
        iconId: Icons.Boar,
        inventory: {},
        skillsExp: {},
        skillsLevel: {},
        level: 1,
        healthPoints: -9,
        staminaPoints: 1,
        manaPoints: 0,
        loot: [
            {
                quantity: 1,
                itemId: 'DeadBoar',
            },
        ],
    },
    [CharTemplateEnum.Wolf]: {
        nameId: 'Wolf',
        iconId: Icons.WolfHead,
        inventory: {},
        skillsExp: {},
        skillsLevel: {},
        level: 2,
        healthPoints: 1,
        staminaPoints: 1,
        manaPoints: 0,
        loot: [
            {
                quantity: 1,
                itemId: 'DeadWolf',
            },
        ],
    },
}
