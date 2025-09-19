import equal from 'react-fast-compare'
import { memoize } from 'proxy-memoize'
import { GameState } from '../game/GameState'
import { selectItemQta } from '../storage/StorageSelectors'
import { selectCraftItemId } from '../storage/storageFunctions'
import { ActivityAdapter } from '../activities/ActivityState'
import { RecipeItem } from './RecipeInterfaces'
import { isCrafting } from './CraftingIterfaces'
import { recipes } from './Recipes'

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

export const selectCurrentCrafting = (s: GameState) => {
    const crafting = s.activities
    const recipeId = s.recipeId
    const paramsValue = s.craftingForm.paramsValue

    const len = paramsValue.length

    const ret = ActivityAdapter.find(crafting, (e) => {
        if (!isCrafting(e)) return false
        if (e.recipeId !== recipeId) return false
        if (len !== e.paramsValue.length) return false
        if (equal(e.paramsValue, paramsValue)) return true
        return false
    })
    return ret?.id ?? null
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
export const selectCraftingIds = memoize((s: GameState) =>
    ActivityAdapter.findManyIds(s.activities, (a) => isCrafting(a) && recipes.get(a.recipeId)?.type === s.ui.recipeType)
)
