import { describe, expect, it } from 'vitest'
import { consumePotion, generatePotion } from '../alchemy/alchemyFunctions'
import { AlchemyItems } from '../alchemy/alchemyItems'
import { NormalAttack } from '../activeAbilities/abilities/NormalAttack'
import { createEnemies } from '../characters/functions/createEnemies'
import { getCharacterDefinition } from '../characters/templates/characterRegistry'
import { generateCharacter } from '../characters/templates/generateCharacter'
import { equipItem } from '../characters/characterFunctions'
import { CharacterAdapter } from '../characters/characterAdapter'
import { PLAYER_ID } from '../characters/charactersConst'
import { regenerateChars } from '../characters/functions/regenerateChars'
import { AppliedEffectAdapter } from '../effects/types/AppliedEffect'
import { GetInitialGameState } from '../game/InitialGameState'
import { initialize } from '../game/functions/initialize'
import { ItemAdapter } from '../storage/ItemAdapter'
import { addItem } from '../storage/storageFunctions'
import { DamageTypes, Item, ItemType, WeaponType } from '../items/Item'
import { Icons } from '../icons/Icons'
import { EquipSlotsEnum } from '../characters/equipSlotsEnum'
import { ExpEnum } from '../experience/ExpEnum'
import { CRAFTED_ITEM_PREFIX } from '../const'
import { Effects } from '../effects/types/Effects'
import { EffectPotency } from '../effects/types/EffectPotency'
import {
    applyWeaponCoating,
    autoApplyBestWeaponCoating,
    applyTemplateWeaponCoating,
    getTemplateWeaponCoating,
    getWeaponCoatingEffectiveness,
    onWeaponHit,
    scaleWeaponCoatingValue,
} from './weaponCoatingFunctions'

const weapon = (id: string, damage: Partial<Record<DamageTypes, number>>): Item => ({
    id,
    nameId: 'Dagger',
    icon: Icons.Dagger,
    type: ItemType.Weapon,
    weaponType: WeaponType.OneHand,
    equipSlot: EquipSlotsEnum.MainHand,
    value: 1,
    volume: 1,
    weaponData: { expType: ExpEnum.OneHanded, damage, attackSpeed: 1000 },
})

describe('weapon coatings', () => {
    it('uses the configured single-type and weighted hybrid effectiveness values', () => {
        expect(getWeaponCoatingEffectiveness(weapon('pierce', { Piercing: 10 }))).toBe(12_000)
        expect(getWeaponCoatingEffectiveness(weapon('slash', { Slashing: 10 }))).toBe(10_000)
        expect(getWeaponCoatingEffectiveness(weapon('blunt', { Bludgeoning: 10 }))).toBe(8_000)
        expect(getWeaponCoatingEffectiveness(weapon('hybrid', { Piercing: 1, Slashing: 1 }))).toBe(11_000)
        expect(scaleWeaponCoatingValue(5, 12_000)).toBe(6)
        expect(scaleWeaponCoatingValue(5, 10_000)).toBe(5)
        expect(scaleWeaponCoatingValue(5, 8_000)).toBe(4)
    })

    it('marks the health regeneration poison recipe result as a coating', () => {
        const state = GetInitialGameState()
        const result = generatePotion(state, true, [AlchemyItems.VenomLeaf!, AlchemyItems.ToxicMushroom!])

        expect(result?.item?.weaponCoatingData).toMatchObject({ charges: 10 })
        expect(result?.item?.weaponCoatingData?.effects).toMatchObject([
            { effect: 'DamageRegenHealth', value: 4, duration: 10_000 },
        ])
    })

    it('supports health, stamina, and mana damage regeneration effects as coatings', () => {
        const state = GetInitialGameState()

        for (const effect of [Effects.DamageRegenHealth, Effects.DamageRegenStamina, Effects.DamageRegenMana]) {
            const first = {
                ...AlchemyItems.VenomLeaf!,
                ingredientData: {
                    ...AlchemyItems.VenomLeaf!.ingredientData!,
                    effects: [{ potency: EffectPotency.Low, effect }],
                },
            }
            const second = {
                ...AlchemyItems.ToxicMushroom!,
                ingredientData: {
                    ...AlchemyItems.ToxicMushroom!.ingredientData!,
                    effects: [{ potency: EffectPotency.Low, effect }],
                },
            }

            expect(generatePotion(state, true, [first, second])?.item?.weaponCoatingData?.effects[0]?.effect).toBe(
                effect
            )
        }
    })

    it('keeps every coating effect from a multi-effect potion', () => {
        const state = GetInitialGameState()
        const effects = [Effects.DamageRegenHealth, Effects.DamageRegenStamina, Effects.DamageRegenMana]
        const ingredients = [AlchemyItems.VenomLeaf!, AlchemyItems.ToxicMushroom!].map((item) => ({
            ...item,
            ingredientData: {
                ...item.ingredientData!,
                effects: effects.map((effect) => ({ potency: EffectPotency.Low, effect })),
            },
        }))

        expect(
            generatePotion(state, true, ingredients)?.item?.weaponCoatingData?.effects.map((effect) => effect.effect)
        ).toEqual(effects)
    })

    it('allows a coating-capable potion to be consumed normally', () => {
        const state = GetInitialGameState()
        const poison = generatePotion(state, true, [AlchemyItems.VenomLeaf!, AlchemyItems.ToxicMushroom!])?.item
        if (!poison) throw new Error('expected poison')
        poison.id = CRAFTED_ITEM_PREFIX + 'consumablePoison'
        ItemAdapter.create(state.craftedItems, poison)
        addItem(state, poison.id, 1)

        consumePotion(state, PLAYER_ID, poison.id)

        expect(AppliedEffectAdapter.find(state.effects, (effect) => effect.target === PLAYER_ID)).toMatchObject({
            effect: Effects.DamageRegenHealth,
            value: -4,
        })
    })

    it('automatically applies the highest-value coating from a non-player character inventory', () => {
        const state = GetInitialGameState()
        const lowValueCoating = generatePotion(state, true, [
            AlchemyItems.VenomLeaf!,
            AlchemyItems.ToxicMushroom!,
        ])?.item
        const highValueCoating = generatePotion(state, true, [
            AlchemyItems.VenomLeaf!,
            AlchemyItems.ToxicMushroom!,
        ])?.item
        if (!lowValueCoating || !highValueCoating) throw new Error('expected coatings')

        lowValueCoating.id = CRAFTED_ITEM_PREFIX + 'lowValueCoating'
        lowValueCoating.value = 1
        highValueCoating.id = CRAFTED_ITEM_PREFIX + 'highValueCoating'
        highValueCoating.value = 2
        ItemAdapter.create(state.craftedItems, lowValueCoating)
        ItemAdapter.create(state.craftedItems, highValueCoating)
        createEnemies(state, [{ quantity: 1, template: 'Chicken' }])
        const enemyId = state.characters.ids.find((id) => id !== PLAYER_ID)
        if (!enemyId) throw new Error('expected enemy')
        const enemy = CharacterAdapter.selectEx(state.characters, enemyId)
        enemy.inventory[EquipSlotsEnum.QuickSlot] = { itemId: lowValueCoating.id, quantity: 2 }
        enemy.inventory[EquipSlotsEnum.Head] = { itemId: highValueCoating.id }

        expect(autoApplyBestWeaponCoating(state, enemy.id)).toBe(true)
        expect(enemy.weaponCoating?.coatingItemId).toBe(highValueCoating.id)
        expect(enemy.inventory[EquipSlotsEnum.Head]).toBeUndefined()
        expect(enemy.inventory[EquipSlotsEnum.QuickSlot]).toEqual({ itemId: lowValueCoating.id, quantity: 2 })
        expect(autoApplyBestWeaponCoating(state, enemy.id)).toBe(false)
    })

    it('applies an enemy template coating without consuming inventory and keeps infinite charges on hits', () => {
        const state = GetInitialGameState()
        createEnemies(state, [{ quantity: 1, template: 'Spider' }])
        const enemyId = state.characters.ids.find((id) => id !== PLAYER_ID)
        if (!enemyId) throw new Error('expected enemy')
        const enemy = CharacterAdapter.selectEx(state.characters, enemyId)
        const inventory = structuredClone(enemy.inventory)

        expect(applyTemplateWeaponCoating(state, enemyId)).toBe(true)
        expect(enemy.weaponCoating).toMatchObject({
            weaponItemId: 'SpiderSpiderMainW',
            remainingCharges: Number.POSITIVE_INFINITY,
        })
        expect(enemy.inventory).toEqual(inventory)

        onWeaponHit(state, enemyId, PLAYER_ID)
        onWeaponHit(state, enemyId, PLAYER_ID)

        expect(enemy.weaponCoating?.remainingCharges).toBe(Number.POSITIVE_INFINITY)
        expect(AppliedEffectAdapter.findMany(state.effects, (effect) => effect.target === PLAYER_ID)).toHaveLength(1)
    })

    it('creates a template coating for an enemy preview outside game state', () => {
        initialize()
        const state = GetInitialGameState()
        const preview = generateCharacter('Spider', getCharacterDefinition('Spider'))

        expect(getTemplateWeaponCoating(state, preview)).toMatchObject({
            weaponItemId: 'SpiderSpiderMainW',
            remainingCharges: Number.POSITIVE_INFINITY,
        })
    })

    it('consumes a charge on a hit, refreshes the target effect, and clears the final charge', () => {
        const state = GetInitialGameState()
        const sword = weapon(CRAFTED_ITEM_PREFIX + 'testSword', { Slashing: 10 })
        const poison = generatePotion(state, true, [AlchemyItems.VenomLeaf!, AlchemyItems.ToxicMushroom!])?.item
        if (!poison) throw new Error('expected poison')
        poison.id = CRAFTED_ITEM_PREFIX + 'testPoison'
        ItemAdapter.create(state.craftedItems, sword)
        ItemAdapter.create(state.craftedItems, poison)
        addItem(state, sword.id, 1)
        addItem(state, poison.id, 2)
        equipItem(state, PLAYER_ID, EquipSlotsEnum.MainHand, sword.id)
        expect(applyWeaponCoating(state, PLAYER_ID, poison.id)).toBe(true)

        createEnemies(state, [{ quantity: 1, template: 'Wolf' }])
        const enemyId = state.characters.ids.find((id) => id !== PLAYER_ID)!
        new NormalAttack().exec({ state, characterId: PLAYER_ID })
        const effect = AppliedEffectAdapter.find(state.effects, (entry) => entry.target === enemyId)
        expect(effect?.value).toBe(-4)
        expect(CharacterAdapter.selectEx(state.characters, PLAYER_ID).weaponCoating?.remainingCharges).toBe(9)

        const oldEffectId = effect?.id
        onWeaponHit(state, PLAYER_ID, enemyId)
        expect(AppliedEffectAdapter.findMany(state.effects, (entry) => entry.target === enemyId)).toHaveLength(1)
        expect(AppliedEffectAdapter.find(state.effects, (entry) => entry.target === enemyId)?.id).toBe(oldEffectId)

        CharacterAdapter.selectEx(state.characters, PLAYER_ID).weaponCoating!.remainingCharges = 1
        onWeaponHit(state, PLAYER_ID, enemyId)
        expect(CharacterAdapter.selectEx(state.characters, PLAYER_ID).weaponCoating).toBeUndefined()
    })

    it('does not apply a coating to a dead target and resolves lethal poison through regeneration', () => {
        const state = GetInitialGameState()
        const sword = weapon(CRAFTED_ITEM_PREFIX + 'testSword', { Slashing: 10 })
        const poison = generatePotion(state, true, [AlchemyItems.VenomLeaf!, AlchemyItems.ToxicMushroom!])?.item
        if (!poison) throw new Error('expected poison')
        poison.id = CRAFTED_ITEM_PREFIX + 'testPoison'
        ItemAdapter.create(state.craftedItems, sword)
        ItemAdapter.create(state.craftedItems, poison)
        addItem(state, sword.id, 1)
        addItem(state, poison.id, 1)
        equipItem(state, PLAYER_ID, EquipSlotsEnum.MainHand, sword.id)
        applyWeaponCoating(state, PLAYER_ID, poison.id)
        createEnemies(state, [{ quantity: 1, template: 'Wolf' }])
        const enemyId = state.characters.ids.find((id) => id !== PLAYER_ID)!
        CharacterAdapter.selectEx(state.characters, enemyId).health = 1

        onWeaponHit(state, PLAYER_ID, enemyId)
        expect(AppliedEffectAdapter.find(state.effects, (entry) => entry.target === enemyId)).toBeDefined()
        regenerateChars(state, 1)
        expect(state.characters.ids).not.toContain(enemyId)
        expect(AppliedEffectAdapter.find(state.effects, (entry) => entry.target === enemyId)).toBeUndefined()
    })

    it('applies stamina and mana damage regeneration coatings on weapon hits', () => {
        for (const effectType of [Effects.DamageRegenStamina, Effects.DamageRegenMana]) {
            const state = GetInitialGameState()
            const sword = weapon(CRAFTED_ITEM_PREFIX + effectType, { Slashing: 10 })
            const coating = generatePotion(state, true, [AlchemyItems.VenomLeaf!, AlchemyItems.ToxicMushroom!])?.item
            if (!coating) throw new Error('expected coating')
            coating.id = CRAFTED_ITEM_PREFIX + `test${effectType}`
            coating.weaponCoatingData!.effects[0]!.effect = effectType
            ItemAdapter.create(state.craftedItems, sword)
            ItemAdapter.create(state.craftedItems, coating)
            addItem(state, sword.id, 1)
            addItem(state, coating.id, 1)
            equipItem(state, PLAYER_ID, EquipSlotsEnum.MainHand, sword.id)
            applyWeaponCoating(state, PLAYER_ID, coating.id)
            createEnemies(state, [{ quantity: 1, template: 'Wolf' }])
            const enemyId = state.characters.ids.find((id) => id !== PLAYER_ID)!

            onWeaponHit(state, PLAYER_ID, enemyId)

            expect(AppliedEffectAdapter.find(state.effects, (effect) => effect.target === enemyId)).toMatchObject({
                effect: effectType,
                value: -4,
            })
        }
    })

    it('applies every effect from a multi-effect coating with one charge', () => {
        const state = GetInitialGameState()
        const sword = weapon(CRAFTED_ITEM_PREFIX + 'multiEffectSword', { Slashing: 10 })
        const coating = generatePotion(state, true, [AlchemyItems.VenomLeaf!, AlchemyItems.ToxicMushroom!])?.item
        if (!coating) throw new Error('expected coating')
        coating.id = CRAFTED_ITEM_PREFIX + 'multiEffectCoating'
        coating.weaponCoatingData!.effects = [
            { effect: Effects.DamageRegenHealth, value: 4, duration: 10_000 },
            { effect: Effects.DamageRegenStamina, value: 4, duration: 10_000 },
            { effect: Effects.DamageRegenMana, value: 4, duration: 10_000 },
        ]
        ItemAdapter.create(state.craftedItems, sword)
        ItemAdapter.create(state.craftedItems, coating)
        addItem(state, sword.id, 1)
        addItem(state, coating.id, 1)
        equipItem(state, PLAYER_ID, EquipSlotsEnum.MainHand, sword.id)
        applyWeaponCoating(state, PLAYER_ID, coating.id)
        createEnemies(state, [{ quantity: 1, template: 'Wolf' }])
        const enemyId = state.characters.ids.find((id) => id !== PLAYER_ID)!

        onWeaponHit(state, PLAYER_ID, enemyId)

        expect(
            AppliedEffectAdapter.findMany(state.effects, (effect) => effect.target === enemyId).map(
                (effect) => effect.effect
            )
        ).toEqual([Effects.DamageRegenHealth, Effects.DamageRegenStamina, Effects.DamageRegenMana])
        expect(CharacterAdapter.selectEx(state.characters, PLAYER_ID).weaponCoating?.remainingCharges).toBe(9)
    })
})
