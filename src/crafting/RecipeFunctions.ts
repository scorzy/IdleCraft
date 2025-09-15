import { GameState } from '../game/GameState'
import { setState } from '../game/setState'
import { GameLocations } from '../gameLocations/GameLocations'
import { RecipeParameterValue } from './RecipeInterfaces'
import { recipes } from './Recipes'

export function changeRecipeState(state: GameState, recipeId: string): void {
    if (state.recipeId === recipeId) return

    state.recipeId = recipeId
    state.craftingForm = {
        paramsValue: [],
        params: [],
        result: undefined,
    }

    const recipe = recipes.get(state.recipeId)
    if (!recipe) return

    const params = recipe.getParameters(state)
    const result = recipe.getResult(state, [])

    state.craftingForm = {
        paramsValue: [],
        params,
        result,
    }
}
export const changeRecipe = (recipeId: string) => setState((state) => changeRecipeState(state, recipeId))

export const setRecipeItemParam = (state: GameState, id: string, paramValue: string) => {
    const paramsValue: RecipeParameterValue[] = state.craftingForm.paramsValue.filter((p) => p.id !== id)

    const value: RecipeParameterValue = { id, itemId: paramValue }

    paramsValue.push(value)

    const recipe = recipes.getEx(state.recipeId)
    const result = recipe.getResult(state, paramsValue)

    state.craftingForm.paramsValue = paramsValue
    state.craftingForm.result = result
}

export const setRecipeItemParamUi = (id: string, paramValue: string) =>
    setState((state) => setRecipeItemParam(state, id, paramValue))

export const recipeOnItemRemove = (state: GameState, itemId: string, location: GameLocations): void => {
    if (state.location !== location) return

    let toRemove = state.craftingForm.paramsValue.find((p) => p.itemId === itemId)

    let n = 0
    while (toRemove && n < 1) {
        n++
        setRecipeItemParam(state, toRemove.id, '')
        toRemove = state.craftingForm.paramsValue.find((p) => p.itemId === itemId)
    }
}
