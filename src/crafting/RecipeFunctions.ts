import { GameState } from '../game/GameState'
import { useGameStore } from '../game/state'
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

export const setRecipeItemParam = (id: string, paramValue: string) =>
    useGameStore.setState((state) => {
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
    })
