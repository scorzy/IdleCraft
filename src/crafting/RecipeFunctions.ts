import { GameState } from '../game/GameState'
import { setState } from '../game/setState'
import { GameLocations } from '../gameLocations/GameLocations'
import { RecipeGroups, RecipeParameterValue } from './RecipeInterfaces'
import { getDefaultRecipeGroup } from './RecipeGroupsData'
import { recipes } from './Recipes'

function selectFormRecipeGroup(
    state: GameState,
    recipeId: string,
    recipeGroup?: RecipeGroups
): RecipeGroups | undefined {
    const recipe = recipes.get(recipeId)
    return recipe?.recipeGroup ?? recipeGroup ?? getDefaultRecipeGroup(state.ui.recipeType)
}

export function changeRecipeState(state: GameState, recipeId: string | null, recipeGroupOverride?: RecipeGroups): void {
    const nextRecipeId = recipeId ?? ''
    const recipeGroup = selectFormRecipeGroup(state, nextRecipeId, recipeGroupOverride)
    if (state.recipeId === nextRecipeId && state.craftingForm.recipeGroup === recipeGroup) return

    state.recipeId = nextRecipeId
    state.craftingForm = {
        recipeGroup,
        paramsValue: [],
        params: [],
        result: undefined,
    }

    const recipe = recipes.get(state.recipeId)
    if (!recipe) return

    const params = recipe.getParameters(state)
    const result = recipe.getResult(state, [])

    state.craftingForm = {
        recipeGroup,
        paramsValue: [],
        params,
        result,
    }
}
export const changeRecipe = (recipeId: string | null) => setState((state) => changeRecipeState(state, recipeId))

export function changeRecipeGroupState(state: GameState, recipeGroup: RecipeGroups): void {
    const recipe = recipes.get(state.recipeId)
    if (state.craftingForm.recipeGroup === recipeGroup && recipe?.recipeGroup === recipeGroup) return

    state.craftingForm.recipeGroup = recipeGroup
    if (recipe?.recipeGroup !== recipeGroup) changeRecipeState(state, null, recipeGroup)
}

export const changeRecipeGroup = (recipeGroup: RecipeGroups) =>
    setState((state) => changeRecipeGroupState(state, recipeGroup))

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
