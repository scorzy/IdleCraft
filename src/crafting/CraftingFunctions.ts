import { GameState } from '../game/GameState'
import { useGameStore } from '../game/state'
import { Item } from '../items/Item'
import { getItemId, getItemId2 } from '../storage/storageFunctions'
import { ItemId } from '../storage/storageState'
import { CraftingActivityCreator } from './CraftingActivityCreator'
import { RecipeParameterValue } from './RecipeInterfaces'
import { Recipes } from './Recipes'

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

    const recipe = Recipes[state.recipeId]
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

export const getRecipeParamId = (r: RecipeParameterValue | ItemId | undefined) =>
    r ? getItemId2(r.stdItemId, r.craftItemId) : ''

export const setRecipeItemParam = (id: string, paramValue: string) =>
    useGameStore.setState((state) => {
        const paramsValue: RecipeParameterValue[] = (state.craftingForm?.paramsValue ?? []).filter((p) => p.id !== id)

        const value: RecipeParameterValue = { ...getItemId(paramValue), id }

        if (value.craftItemId || value.stdItemId) paramsValue.push(value)

        const recipe = Recipes[state.recipeId]
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

export const addCrafting = () =>
    useGameStore.setState((state) => {
        return new CraftingActivityCreator(state, null).createActivity()
    })

export function getItemValue(components: Item[], isFinalItem: boolean): number {
    let value = 0
    for (const comp of components) value += comp.value
    let prestige = 1
    if (isFinalItem) for (const comp of components) if (comp.craftingData) prestige *= comp.craftingData?.prestige

    return Math.floor(value * prestige)
}
export function getCraftingTime(components: Item[]): number {
    return components.length * 1.5e3
}
