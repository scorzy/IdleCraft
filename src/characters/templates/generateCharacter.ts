import { CharacterState } from '../characterState'
import { CharTemplate } from './charTemplates'

// eslint-disable-next-line import/no-unused-modules
export function generateCharacter(template: CharTemplate): CharacterState {
    const char: CharacterState = structuredClone({
        inventory: template.inventory,
        skillsExp: template.skillsExp,
        skillsLevel: template.skillsLevel,
        exp: 0,
        level: template.level,
        enemy: false,
        healthPoints: template.healthPoints,
        staminaPoints: template.staminaPoints,
        manaPoints: template.manaPoints,
        combatAbilities: [],
    })

    return char
}
