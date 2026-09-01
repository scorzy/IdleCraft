import { describe, expect, it } from 'vitest'
import { EffectPotency } from '../effects/types/EffectPotency'
import { Effects } from '../effects/types/Effects'
import { GetInitialGameState } from '../game/InitialGameState'
import { Icons } from '../icons/Icons'
import { Item, ItemType, CraftingType } from '../items/Item'
import { selectItemName } from '../items/selectors/selectItemName'
import { IngredientTypes } from './alchemyTypes'
import { generatePotion } from './alchemyFunctions'

function ingredient(id: string, effects: { effect: Effects; potency: EffectPotency }[]): Item {
    return {
        id,
        nameId: 'Ingredient',
        icon: Icons.Leaf,
        type: ItemType.Crafting,
        craftingTypes: [CraftingType.AlchemyIngredient],
        value: 1,
        volume: 1,
        ingredientData: {
            type: IngredientTypes.Herb,
            stability: 20,
            effects,
        },
    }
}

describe('generatePotion', () => {
    it('uses the strongest effect for the translated potion name', () => {
        const state = GetInitialGameState()
        const weakMana = { effect: Effects.Mana, potency: EffectPotency.Low }
        const strongHealth = { effect: Effects.Health, potency: EffectPotency.High }
        const potion = generatePotion(state, true, [
            ingredient('first', [weakMana, strongHealth]),
            ingredient('second', [weakMana, strongHealth]),
        ])

        expect(potion?.item?.nameId).toBe('HealthPotion')
        expect(potion?.item).toMatchObject({ color: 'text-health', icon: Icons.Potion })
        expect(selectItemName(state, potion?.item)).toBe('Health Potion')
    })

    it('uses the effect-specific translation for poison potions', () => {
        const state = GetInitialGameState()
        const damageStamina = { effect: Effects.DamageStamina, potency: EffectPotency.Low }
        const potion = generatePotion(state, true, [
            ingredient('first', [damageStamina]),
            ingredient('second', [damageStamina]),
        ])

        expect(potion?.item?.nameId).toBe('DamageStaminaPotion')
        expect(potion?.item).toMatchObject({ color: 'text-stamina', icon: Icons.Poison })
        expect(selectItemName(state, potion?.item)).toBe('Stamina Poison')
    })
})
