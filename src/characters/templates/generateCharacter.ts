import { CharAbilityAdapter } from '../../activeAbilities/CharAbilityAdapter'
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
        isEnemy: false,
        healthPoints: template.healthPoints,
        staminaPoints: template.staminaPoints,
        manaPoints: template.manaPoints,
        health: 100,
        mana: 100,
        stamina: 100,
        combatAbilities: [],
        allCombatAbilities: CharAbilityAdapter.getInitialState(),
    })

    return char
}
