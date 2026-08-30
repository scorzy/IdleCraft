import { CharAbilityAdapter } from '../../activeAbilities/abilityAdapters'
import { getUniqueId } from '../../utils/getUniqueId'
import { CharacterState } from '../characterState'
import { selectMaxHealthFromChar } from '../selectors/healthSelectors'
import { selectMaxManaFromChar } from '../selectors/manaSelectors'
import { selectMaxStaminaFromChar } from '../selectors/staminaSelectors'
import { CharacterDefinition } from './characterInterfaces'
import { resolveCharacterItemRef } from './characterRegistry'

const getAllCombatAbilities = (template: CharacterDefinition) => {
    if (template.allCombatAbilities) return template.allCombatAbilities
    if (!template.combatAbilities?.length) return CharAbilityAdapter.getInitialState()

    const ids = [...new Set(template.combatAbilities)]
    return {
        ids,
        entries: Object.fromEntries(ids.map((id) => [id, { id, abilityId: id }])),
    }
}

export const generateCharacter = (templateId: string, template: CharacterDefinition) => {
    const char: CharacterState = structuredClone({
        id: getUniqueId(),
        templateId,
        nameId: template.nameId,
        iconId: template.iconId,
        inventory: Object.fromEntries(
            Object.entries(template.inventory).map(([slot, item]) => [
                slot,
                item && { ...item, itemId: resolveCharacterItemRef(templateId, template, item.itemId) },
            ])
        ),
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
        combatAbilities: [...(template.combatAbilities ?? [])],
        allCombatAbilities: getAllCombatAbilities(template),
        lastCombatAbilityId: null,
        lastCombatAbilityNum: 0,
        perks: {},
        loot: template.loot.map((loot) => ({
            ...loot,
            itemId: resolveCharacterItemRef(templateId, template, loot.itemId),
        })),
    })

    if (template.randomizeAbilitiesOrder)
        char.combatAbilities = [...char.combatAbilities].toSorted(() => Math.random() - 0.5)

    char.health = selectMaxHealthFromChar(char).total
    char.mana = selectMaxManaFromChar(char).total
    char.stamina = selectMaxStaminaFromChar(char).total

    return char
}
