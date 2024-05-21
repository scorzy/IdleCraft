import { CharAbilityAdapter } from '../../activeAbilities/abilityAdapters'
import { getUniqueId } from '../../utils/getUniqueId'
import { memoize } from '../../utils/memoize'
import { CharacterState } from '../characterState'
import { selectMaxHealthFromChar } from '../selectors/healthSelectors'
import { selectMaxManaFromChar } from '../selectors/manaSelectors'
import { selectMaxStaminaFromChar } from '../selectors/staminaSelectors'
import { CharTemplate } from './charTemplates'

export const generateCharacter = memoize(function (template: CharTemplate): CharacterState {
    const char: CharacterState = structuredClone({
        id: getUniqueId(),
        nameId: template.nameId,
        iconId: template.iconId,
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
        lastCombatAbilityId: null,
        lastCombatAbilityNum: 0,
        perks: {},
        loot: template.loot,
    })

    char.health = selectMaxHealthFromChar(char).total
    char.mana = selectMaxManaFromChar(char).total
    char.stamina = selectMaxStaminaFromChar(char).total

    return char
})
