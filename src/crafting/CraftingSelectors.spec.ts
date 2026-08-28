import { afterEach, describe, expect, it } from 'vitest'
import { GetInitialGameState } from '../game/InitialGameState'
import { Icons } from '../icons/Icons'
import { barRecipe } from '../smithing/recipes/BarRecipe'
import { addItem } from '../storage/storageFunctions'
import { getVendorPurchaseOption } from '../vendors/VendorData'
import { canCraft, selectCraftingFormResult } from './CraftingSelectors'
import { Recipe } from './Recipe'
import { RecipeTypes } from './RecipeInterfaces'
import { recipes } from './Recipes'

const liveResultRecipe: Recipe = {
    id: 'live-result-recipe',
    type: RecipeTypes.Smithing,
    nameId: 'Bar',
    iconId: Icons.Bar,
    getParameters: () => [],
    getResult: (state) => ({
        time: state.gold === 0 ? 1_000 : 2_000,
        requirements: [],
        results: [{ id: 'CopperBar', stdItemId: 'CopperBar', qta: state.gold === 0 ? 1 : 2 }],
    }),
}

const setCopperRecipe = (state: ReturnType<typeof GetInitialGameState>) => {
    recipes.set(barRecipe.id, barRecipe)
    state.recipeId = barRecipe.id
    state.craftingForm.paramsValue = [{ id: 'ore', itemId: 'CopperOre' }]
}

afterEach(() => {
    recipes.delete(barRecipe.id)
    recipes.delete(liveResultRecipe.id)
})

describe('canCraft', () => {
    it('is enabled when the required quantity is owned without auto buy', () => {
        const state = GetInitialGameState()
        setCopperRecipe(state)
        addItem(state, 'CopperOre', 1)

        expect(canCraft(state)).toBe(true)
    })

    it('is disabled when the required quantity is missing and auto buy is off', () => {
        const state = GetInitialGameState()
        setCopperRecipe(state)

        expect(canCraft(state)).toBe(false)
    })

    it('is enabled when auto buy covers the missing quantity and gold is sufficient', () => {
        const state = GetInitialGameState()
        setCopperRecipe(state)
        state.craftingForm.autoBuy.CopperOre = true
        state.gold = getVendorPurchaseOption(state.location, 'CopperOre')!.unitPrice

        expect(canCraft(state)).toBe(true)
    })

    it('is disabled when auto buy is on but gold is insufficient', () => {
        const state = GetInitialGameState()
        setCopperRecipe(state)
        state.craftingForm.autoBuy.CopperOre = true
        state.gold = 0

        expect(canCraft(state)).toBe(false)
    })

    it('derives the form result again when a recipe-dependent state value changes', () => {
        const state = GetInitialGameState()
        recipes.set(liveResultRecipe.id, liveResultRecipe)
        state.recipeId = liveResultRecipe.id

        expect(selectCraftingFormResult(state)).toMatchObject({ time: 1_000, results: [{ qta: 1 }] })

        expect(selectCraftingFormResult({ ...state, gold: 1 })).toMatchObject({ time: 2_000, results: [{ qta: 2 }] })
    })
})
