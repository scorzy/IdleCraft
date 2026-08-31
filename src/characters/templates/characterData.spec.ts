import { describe, expect, it } from 'vitest'
import { AbilitiesEnum } from '../../activeAbilities/abilitiesEnum'
import { ExpEnum } from '../../experience/ExpEnum'
import { Icons } from '../../icons/Icons'
import { ItemTypes } from '../../items/Item'
import { StdItems } from '../../items/stdItems'
import { initialize } from '../../game/functions/initialize'
import { CharacterDefinition, CharacterItem } from './characterInterfaces'
import { AnimalCharacterData } from './characterData.animals'
import { generateCharacter } from './generateCharacter'
import { getCharacterItemId, resolveCharacterItemRef } from './characterRegistry'

describe('character data', () => {
    it.each(Object.entries(AnimalCharacterData))('validates the %s character definition', (templateId, definition) => {
        expect(definition.nameId).toBe(templateId)
        expect(definition.level).toBeGreaterThan(0)

        for (const [itemId, item] of Object.entries(definition.items)) {
            expect(item.id).toBe(itemId)
        }

        const assertLocalItemReference = (itemId: string) => {
            expect(definition.items[itemId]).toBeDefined()
            expect(resolveCharacterItemRef(templateId, definition, itemId)).toBe(getCharacterItemId(templateId, itemId))
        }

        Object.values(definition.inventory).forEach((entry) => {
            if (!entry) return
            expect(entry.quantity ?? 1).toBeGreaterThan(0)
            if (typeof entry.itemId === 'string') assertLocalItemReference(entry.itemId)
        })
        definition.loot.forEach(({ itemId, quantity }) => {
            expect(quantity).toBeGreaterThan(0)
            if (typeof itemId === 'string') assertLocalItemReference(itemId)
        })

        definition.combatAbilities?.forEach((ability) => {
            expect(Object.values(AbilitiesEnum)).toContain(ability)
        })
    })

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
        expect((StdItems.SpiderDeadSpider as CharacterItem).butchering).toEqual([
            { id: 'VenomGland', stdItemId: 'VenomGland', qta: 1 },
            { id: 'SpiderEggSac', stdItemId: 'SpiderEggSac', qta: 1 },
        ])
    })

    it('defines the spider poison as an infinite template weapon coating', () => {
        const spider = AnimalCharacterData.Spider!

        expect(spider.items.SpiderPoison).toBeUndefined()
        expect(spider.inventory.QuickSlot).toBeUndefined()
        expect(spider.weaponCoating).toMatchObject({
            charges: Number.POSITIVE_INFINITY,
            effects: [{ effect: 'DamageRegenHealth', value: 2, duration: 10_000 }],
        })
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
