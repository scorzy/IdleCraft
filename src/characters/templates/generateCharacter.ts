import { memoize } from 'micro-memoize'
import { CharAbilityAdapter } from '../../activeAbilities/abilityAdapters'
import { getUniqueId } from '../../utils/getUniqueId'
import { CharacterState } from '../characterState'
import { selectMaxHealthFromChar } from '../selectors/healthSelectors'
import { selectMaxManaFromChar } from '../selectors/manaSelectors'
import { selectMaxStaminaFromChar } from '../selectors/staminaSelectors'
import { CharacterDefinition } from './characterInterfaces'
import { resolveCharacterItemRef } from './characterRegistry'

const generateCharacterInt = memoize(
    (templateId: string, template: CharacterDefinition) => {
        const char: CharacterState = {
            id: getUniqueId(),
            templateId,
            nameId: template.nameId,
            iconId: template.iconId,
            inventory: Object.fromEntries(
                Object.entries(template.inventory).map(([slot, item]) => [
                    slot,
                    item && { ...item, itemId: resolveCharacterItemRef(item.itemId) },
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
            combatAbilities: [],
            allCombatAbilities: CharAbilityAdapter.getInitialState(),
            lastCombatAbilityId: null,
            lastCombatAbilityNum: 0,
            perks: {},
            loot: template.loot.map((loot) => ({ ...loot, itemId: resolveCharacterItemRef(loot.itemId) })),
        }

        char.health = selectMaxHealthFromChar(char).total
        char.mana = selectMaxManaFromChar(char).total
        char.stamina = selectMaxStaminaFromChar(char).total

        return char
    },
    { maxSize: 100 }
)

export function generateCharacter(templateId: string, template: CharacterDefinition): CharacterState {
    const char: CharacterState = structuredClone(generateCharacterInt(templateId, template))
    char.id = getUniqueId()

    return char
}
