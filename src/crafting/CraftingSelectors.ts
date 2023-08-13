import { GameState } from '../game/GameState'
import { memoizeOne } from '../utils/memoizeOne'
import { CraftingAdapter } from './CraftingAdapter'
import { Crafting } from './CraftingIterfaces'
import { RecipeItem, RecipeParameter, RecipeParameterValue } from './RecipeInterfaces'
import equal from 'react-fast-compare'
import { InitialState } from '../entityAdapter/entityAdapter'
import { memoize } from '../utils/memoize'
import { selectCraftItem } from '../storage/storageFunctions'
import { selectItemQta } from '../storage/StorageSelectors'

const EMPTY_ARR: RecipeParameter[] = []
export const selectRecipeParams = (state: GameState) => state.craftingForm?.params ?? EMPTY_ARR
export const selectRecipeItemValue = (recipeParamId: string) => (state: GameState) =>
    state.craftingForm.paramsValue.find((p) => p.id === recipeParamId)

export const selectRecipeResult = (state: GameState) => state.craftingForm.result?.results
export const selectRecipeReq = (state: GameState) => state.craftingForm.result?.requirements
export const selectRecipeType = (s: GameState) => s.ui.recipeType
export const canCraft = (s: GameState) => s.craftingForm.result !== undefined && s.craftingForm.result !== null

export const selectCraftTime = (s: GameState) => s.craftingForm.result?.time

export const compareCrafting = memoizeOne((crafting: InitialState<Crafting>, recipeId: string) => {
    const compare = memoize((values: RecipeParameterValue[]) => {
        const len = values.length

        const ret = CraftingAdapter.find(crafting, (e) => {
            if (e.recipeId !== recipeId) return false
            if (len !== e.paramsValue.length) return false
            if (equal(e.paramsValue, values)) return true
            return false
        })
        return ret?.activityId ?? null
    })
    return compare
})

export function selectCurrentCrafting(s: GameState): string | null {
    if (s.craftingForm.params === undefined) return null
    return compareCrafting(s.crafting, s.recipeId)(s.craftingForm.paramsValue)
}

export const selectResultQta = (result?: RecipeItem) => (s: GameState) => {
    if (!result) return 0
    if (result.stdItemId) {
        return selectItemQta(null, result.stdItemId, null)(s)
    } else if (result.craftedItemId) {
        const craftId = selectCraftItem(s.craftedItems, result.craftedItemId)
        if (!craftId) return 0
        return selectItemQta(null, null, craftId)(s)
    }
    return 0
}
