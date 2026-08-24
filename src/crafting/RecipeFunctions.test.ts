import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { GetInitialGameState } from '../game/InitialGameState'
import { armourRecipe } from '../smithing/recipes/ArmourRecipes'
import { barRecipe } from '../smithing/recipes/BarRecipe'
import { daggerRecipe } from '../smithing/recipes/Dagger'
import { addItem } from '../storage/storageFunctions'
import { selectRecipeGroup } from './CraftingSelectors'
import {
    changeRecipeGroupState,
    changeRecipeState,
    recipeOnItemRemove,
    setCraftingAutoBuyState,
    setRecipeItemParam,
} from './RecipeFunctions'
import { RecipeGroups, RecipeTypes } from './RecipeInterfaces'
import { recipes } from './Recipes'

const originalRecipes = Array.from(recipes.entries())

describe('RecipeFunctions', () => {
    beforeEach(() => {
        recipes.clear()
        recipes.set(armourRecipe.id, armourRecipe)
        recipes.set(barRecipe.id, barRecipe)
        recipes.set(daggerRecipe.id, daggerRecipe)
    })

    afterEach(() => {
        recipes.clear()
        for (const [id, recipe] of originalRecipes) recipes.set(id, recipe)
    })

    it('stores the selected recipe group when changing recipes', () => {
        const state = GetInitialGameState()
        state.ui.recipeType = RecipeTypes.Smithing

        changeRecipeState(state, daggerRecipe.id)

        expect(state.recipeId).toBe(daggerRecipe.id)
        expect(state.craftingForm.recipeGroup).toBe(RecipeGroups.Weapons)
        expect(selectRecipeGroup(state)).toBe(RecipeGroups.Weapons)
    })

    it('clears an incompatible recipe when changing recipe group', () => {
        const state = GetInitialGameState()
        state.ui.recipeType = RecipeTypes.Smithing
        changeRecipeState(state, daggerRecipe.id)

        changeRecipeGroupState(state, RecipeGroups.Armours)

        expect(state.recipeId).toBe('')
        expect(state.craftingForm.recipeGroup).toBe(RecipeGroups.Armours)
        expect(state.craftingForm.params).toEqual([])
        expect(state.craftingForm.paramsValue).toEqual([])
        expect(state.craftingForm.result).toBeUndefined()
    })

    it('enables auto buy when selecting a purchasable ingredient that is not available', () => {
        const state = GetInitialGameState()
        state.ui.recipeType = RecipeTypes.Smithing
        changeRecipeState(state, barRecipe.id)

        setRecipeItemParam(state, 'ore', 'CopperOre')

        expect(state.craftingForm.paramsValue).toContainEqual({ id: 'ore', itemId: 'CopperOre' })
        expect(state.craftingForm.autoBuy.CopperOre).toBe(true)
    })

    it('leaves auto buy optional when the selected ingredient is already available', () => {
        const state = GetInitialGameState()
        state.ui.recipeType = RecipeTypes.Smithing
        addItem(state, 'CopperOre', 1)
        changeRecipeState(state, barRecipe.id)

        setRecipeItemParam(state, 'ore', 'CopperOre')

        expect(state.craftingForm.autoBuy.CopperOre).toBeUndefined()

        setCraftingAutoBuyState(state, 'CopperOre', true)
        expect(state.craftingForm.autoBuy.CopperOre).toBe(true)

        setCraftingAutoBuyState(state, 'CopperOre', false)
        expect(state.craftingForm.autoBuy.CopperOre).toBeUndefined()
    })

    it('keeps an auto-buy recipe selection when the owned item is removed', () => {
        const state = GetInitialGameState()
        state.ui.recipeType = RecipeTypes.Smithing
        changeRecipeState(state, barRecipe.id)
        setRecipeItemParam(state, 'ore', 'CopperOre')

        recipeOnItemRemove(state, 'CopperOre', state.location)

        expect(state.craftingForm.paramsValue).toContainEqual({ id: 'ore', itemId: 'CopperOre' })
    })
})
