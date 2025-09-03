import { GameState } from '../game/GameState'
import { useGameStore } from '../game/state'
import { GameLocations } from '../gameLocations/GameLocations'
import { RecipeParameterValue } from './RecipeInterfaces'
import { recipes } from './Recipes'

export function changeRecipeState(state: GameState, recipeId: string) {
    if (state.recipeId === recipeId) return state

    state = {
        ...state,
        recipeId,
        craftingForm: {
            paramsValue: [],
            params: [],
            result: undefined,
        },
    }

    const recipe = recipes.get(state.recipeId)
    if (!recipe) return state

    const params = recipe.getParameters(state)
    const result = recipe.getResult(state, [])

    state = {
        ...state,
        craftingForm: {
            paramsValue: [],
            params,
            result,
        },
    }

    return state
}
export const changeRecipe = (recipeId: string) => useGameStore.setState((state) => changeRecipeState(state, recipeId))

export const setRecipeItemParam = (state: GameState, id: string, paramValue: string) => {
    const paramsValue: RecipeParameterValue[] = state.craftingForm.paramsValue.filter((p) => p.id !== id)

    const value: RecipeParameterValue = { id, itemId: paramValue }

    paramsValue.push(value)

    const recipe = recipes.getEx(state.recipeId)
    const result = recipe.getResult(state, paramsValue)

    state = {
        ...state,
        craftingForm: {
            ...state.craftingForm,
            paramsValue,
            result,
        },
    }

    return state
}

export const setRecipeItemParamUi = (id: string, paramValue: string) =>
    useGameStore.setState((state) => setRecipeItemParam(state, id, paramValue))

export const recipeOnItemRemove = (state: GameState, itemId: string, location: GameLocations): GameState => {
    if (state.location !== location) return state

    let toRemove = state.craftingForm.paramsValue.find((p) => p.itemId === itemId)

    let n = 0
    while (toRemove && n < 1) {
        n++
        state = setRecipeItemParam(state, toRemove.id, '')
        toRemove = state.craftingForm.paramsValue.find((p) => p.itemId === itemId)
    }

    return state
}
