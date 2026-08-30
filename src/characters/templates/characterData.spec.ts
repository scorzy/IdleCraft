import { describe, expect, it } from 'vitest'
import { AbilitiesEnum } from '../../activeAbilities/abilitiesEnum'
import { ExpEnum } from '../../experience/ExpEnum'
import { Icons } from '../../icons/Icons'
import { ItemTypes } from '../../items/Item'
import { StdItems } from '../../items/stdItems'
import { initialize } from '../../game/functions/initialize'
import { CharacterDefinition, CharacterItem } from './characterInterfaces'
import { generateCharacter } from './generateCharacter'

describe('character data', () => {
    it('normalizes inline character item references in generated runtime state', () => {
        const inlineWeapon = {
            id: 'InlineWeapon',
            nameId: 'Chicken' as const,
            icon: Icons.Chicken,
            type: ItemTypes.TwoHands,
            value: 0,
            volume: 1,
            weaponData: { attackSpeed: 1000, expType: ExpEnum.TwoHanded, damage: { Piercing: 1 } },
        }
        const definition: CharacterDefinition = {
            nameId: 'Chicken',
            iconId: Icons.Chicken,
            items: {},
            inventory: { TwoHand: { itemId: inlineWeapon } },
            skillsExp: {},
            skillsLevel: {},
            level: 1,
            healthPoints: 0,
            staminaPoints: 0,
            manaPoints: 0,
            loot: [{ itemId: inlineWeapon, quantity: 1 }],
        }

        const character = generateCharacter('InlineCharacter', definition)

        expect(character.inventory.TwoHand?.itemId).toBe('InlineCharacterInlineWeapon')
        expect(character.loot).toEqual([{ itemId: 'InlineCharacterInlineWeapon', quantity: 1 }])
    })

    it('registers nested enemy items during initialization', () => {
        initialize()

        expect(StdItems.ChickenChickenBeak).toBeDefined()
        expect((StdItems.ChickenDeadChicken as CharacterItem).butchering).toEqual([
            { id: 'WhiteMeat', stdItemId: 'WhiteMeat', qta: 1 },
        ])
    })

    it('infers unique available combat abilities from a template rotation', () => {
        const character = generateCharacter('Boar', {
            nameId: 'Boar',
            iconId: Icons.Boar,
            items: {},
            inventory: {},
            skillsExp: {},
            skillsLevel: {},
            level: 1,
            healthPoints: 0,
            staminaPoints: 0,
            manaPoints: 0,
            loot: [],
            combatAbilities: [AbilitiesEnum.NormalAttack, AbilitiesEnum.NormalAttack, AbilitiesEnum.ChargedAttack],
        })

        expect(character.allCombatAbilities).toEqual({
            ids: [AbilitiesEnum.NormalAttack, AbilitiesEnum.ChargedAttack],
            entries: {
                [AbilitiesEnum.NormalAttack]: { id: AbilitiesEnum.NormalAttack, abilityId: AbilitiesEnum.NormalAttack },
                [AbilitiesEnum.ChargedAttack]: {
                    id: AbilitiesEnum.ChargedAttack,
                    abilityId: AbilitiesEnum.ChargedAttack,
                },
            },
        })
    })

    it('preserves explicit combat abilities and defaults to normal attack without a rotation', () => {
        const definition: CharacterDefinition = {
            nameId: 'Chicken',
            iconId: Icons.Chicken,
            items: {},
            inventory: {},
            skillsExp: {},
            skillsLevel: {},
            level: 1,
            healthPoints: 0,
            staminaPoints: 0,
            manaPoints: 0,
            loot: [],
            allCombatAbilities: {
                ids: ['charged'],
                entries: { charged: { id: 'charged', abilityId: AbilitiesEnum.ChargedAttack } },
            },
        }

        expect(generateCharacter('ExplicitAbilities', definition).allCombatAbilities).toEqual(
            definition.allCombatAbilities
        )

        const defaultCharacter = generateCharacter('DefaultAbilities', {
            ...definition,
            allCombatAbilities: undefined,
        })
        expect(defaultCharacter.allCombatAbilities).toEqual({
            ids: [AbilitiesEnum.NormalAttack],
            entries: {
                [AbilitiesEnum.NormalAttack]: { id: AbilitiesEnum.NormalAttack, abilityId: AbilitiesEnum.NormalAttack },
            },
        })
    })
})
