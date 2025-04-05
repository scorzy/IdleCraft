import equal from 'react-fast-compare'
import { GameState } from '../game/GameState'
import { myMemoizeOne } from '../utils/myMemoizeOne'
import { myMemoize } from '../utils/myMemoize'
import { selectItemQta } from '../storage/StorageSelectors'
import { selectCraftItemId } from '../storage/storageFunctions'
import { ActivityAdapter, ActivityState } from '../activities/ActivityState'
import { RecipeItem, RecipeParameterValue } from './RecipeInterfaces'
import { isCrafting } from './CraftingIterfaces'
import { InitialState } from '@/entityAdapter/InitialState'

export const getCraftingActivity = (s: GameState, id: string) => {
    const act = ActivityAdapter.selectEx(s.activities, id)
    if (!isCrafting(act)) throw new Error(`Activity ${id} is not a crafting activity`)
    return act
}

export const selectRecipeId = (s: GameState) => s.recipeId
export const selectRecipeParams = (state: GameState) => state.craftingForm.params
export const selectRecipeItemValue = (recipeParamId: string) => (state: GameState) =>
    state.craftingForm.paramsValue.find((p) => p.id === recipeParamId)

export const selectRecipeResult = (state: GameState) => state.craftingForm.result?.results
export const selectRecipeReq = (state: GameState) => state.craftingForm.result?.requirements
export const selectRecipeType = (s: GameState) => s.ui.recipeType
export const canCraft = (s: GameState) => s.craftingForm.result !== undefined && s.craftingForm.result

export const selectCraftTime = (s: GameState) => s.craftingForm.result?.time

const compareCrafting = myMemoizeOne((crafting: InitialState<ActivityState>, recipeId: string) => {
    const compare = myMemoize((values: RecipeParameterValue[]) => {
        const len = values.length

        const ret = ActivityAdapter.find(crafting, (e) => {
            if (!isCrafting(e)) return false
            if (e.recipeId !== recipeId) return false
            if (len !== e.paramsValue.length) return false
            if (equal(e.paramsValue, values)) return true
            return false
        })
        return ret?.id ?? null
    })
    return compare
})

export function selectCurrentCrafting(s: GameState): string | null {
    return compareCrafting(s.activities, s.recipeId)(s.craftingForm.paramsValue)
}

export const selectResultQta = (result?: RecipeItem) => (s: GameState) => {
    if (!result) return 0
    if (result.stdItemId) {
        return selectItemQta(null, result.stdItemId)(s)
    } else if (result.craftedItem) {
        const craftId = selectCraftItemId(s.craftedItems, result.craftedItem)
        if (!craftId) return 0
        return selectItemQta(null, craftId)(s)
    }
    return 0
}
