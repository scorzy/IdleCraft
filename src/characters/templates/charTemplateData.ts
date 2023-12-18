import { CharTemplate } from './charTemplates'
import { CharTemplateEnum } from './characterTemplateEnum'

export const CharTemplatesData: { [k in CharTemplateEnum]: CharTemplate } = {
    [CharTemplateEnum.Boar]: {
        inventory: {},
        skillsExp: {},
        skillsLevel: {},
        level: 1,
        healthPoints: 1,
        staminaPoints: 1,
        manaPoints: 0,
    },
}
