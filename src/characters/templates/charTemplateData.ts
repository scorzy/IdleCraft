import { Icons } from '../../icons/Icons'
import { CharTemplate } from './charTemplates'
import { CharTemplateEnum } from './characterTemplateEnum'

export const CharTemplatesData: Record<CharTemplateEnum, CharTemplate> = {
    [CharTemplateEnum.Boar]: {
        id: CharTemplateEnum.Boar,
        nameId: 'Boar',
        iconId: Icons.Boar,
        inventory: {
            TwoHand: {
                itemId: 'BoarTusk',
            },
        },
        skillsExp: {},
        skillsLevel: {},
        level: 1,
        healthPoints: -9,
        staminaPoints: -9,
        manaPoints: 0,
        loot: [
            {
                quantity: 1,
                itemId: 'DeadBoar',
            },
        ],
    },
    [CharTemplateEnum.Wolf]: {
        id: CharTemplateEnum.Wolf,
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
