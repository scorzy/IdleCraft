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
                stdItem: 'DeadBoar',
                craftedItem: null,
            },
        ],
    },
}
