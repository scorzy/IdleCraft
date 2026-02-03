import { Icons } from '../../icons/Icons'
import { CharTemplate } from './charTemplates'
import { CharTemplateEnum } from './characterTemplateEnum'

export const CharTemplatesData: Record<CharTemplateEnum, CharTemplate> = {
    [CharTemplateEnum.Chicken]: {
        id: CharTemplateEnum.Chicken,
        nameId: 'Chicken',
        iconId: Icons.Chicken,
        inventory: {
            TwoHand: {
                itemId: 'ChickenBeak',
            },
        },
        skillsExp: {},
        skillsLevel: {},
        level: 1,
        healthPoints: -9,
        staminaPoints: -8,
        manaPoints: -8,
        loot: [
            {
                quantity: 1,
                itemId: 'DeadChicken',
            },
        ],
    },
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
        level: 2,
        healthPoints: -5,
        staminaPoints: -3,
        manaPoints: -8,
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
        level: 3,
        healthPoints: 1,
        staminaPoints: 1,
        manaPoints: -8,
        loot: [
            {
                quantity: 1,
                itemId: 'DeadWolf',
            },
        ],
    },
}
