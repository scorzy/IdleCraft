import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { GetInitialGameState } from '../game/InitialGameState'
import { armourRecipe } from '../smithing/recipes/ArmourRecipes'
import { daggerRecipe } from '../smithing/recipes/Dagger'
import { selectRecipeGroup } from './CraftingSelectors'
import { changeRecipeGroupState, changeRecipeState } from './RecipeFunctions'
import { RecipeGroups, RecipeTypes } from './RecipeInterfaces'
import { recipes } from './Recipes'

const originalRecipes = Array.from(recipes.entries())

describe('RecipeFunctions', () => {
    beforeEach(() => {
        recipes.clear()
        recipes.set(armourRecipe.id, armourRecipe)
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
})
