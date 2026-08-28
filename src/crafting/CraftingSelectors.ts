import { memoize } from 'proxy-memoize'
import equal from 'react-fast-compare'
import { ActivityAdapter } from '../activities/ActivityState'
import { isPotionItem } from '../alchemy/PotionCraftingResult'
import { GameState } from '../game/GameState'
import { Item } from '../items/Item'
import { StdItems } from '../items/stdItems'
import { selectItemQta } from '../storage/StorageSelectors'
import { selectCraftItemId } from '../storage/storageFunctions'
import { isCrafting } from './CraftingIterfaces'
import { getCraftingPurchasePlan } from './functions/autoBuyCrafting'
import { RecipeGroups, RecipeItem, RecipeParameterValue, RecipeResult } from './RecipeInterfaces'
import { getDefaultRecipeGroup } from './RecipeGroupsData'
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

export const getRecipeResult = (
    state: GameState,
    recipeId: string,
    paramsValue: RecipeParameterValue[]
): RecipeResult | undefined => recipes.get(recipeId)?.getResult(state, paramsValue)

export const selectCraftingFormResult = memoize((state: GameState) =>
    getRecipeResult(state, state.recipeId, state.craftingForm.paramsValue)
)

export const selectRecipeResult = (state: GameState) => selectCraftingFormResult(state)?.results
export const selectRecipeReq = (state: GameState) => selectCraftingFormResult(state)?.requirements
export const selectCraftingAutoBuy = (state: GameState) => state.craftingForm.autoBuy
export const selectRecipeType = (s: GameState) => s.ui.recipeType
export const selectRecipeGroup = (s: GameState): RecipeGroups | undefined =>
    recipes.get(s.recipeId)?.recipeGroup ?? s.craftingForm.recipeGroup ?? getDefaultRecipeGroup(s.ui.recipeType)
export const canCraft = (s: GameState) => {
    const result = selectCraftingFormResult(s)
    if (!result?.results.some((item) => item.craftedItem || item.stdItemId)) return false
    return selectCraftingPurchasePlan(s).canCraft
}

export const selectCraftTime = (s: GameState) => selectCraftingFormResult(s)?.time
export const selectCraftingPurchasePlan = memoize((state: GameState) =>
    getCraftingPurchasePlan(state, selectCraftingFormResult(state), state.craftingForm.autoBuy)
)

export const selectCurrentCrafting = (s: GameState) => {
    const crafting = s.activities
    const recipeId = s.recipeId
    const paramsValue = s.craftingForm.paramsValue

    const len = paramsValue.length

    const ret = ActivityAdapter.find(crafting, (e) => {
        if (!isCrafting(e)) return false
        if (e.recipeId !== recipeId) return false
        if (len !== e.paramsValue.length) return false
        if (equal(e.paramsValue, paramsValue) && equal(e.autoBuy ?? {}, s.craftingForm.autoBuy)) return true
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

export const selectRecipeResultItem = (state: GameState) => {
    const results = selectRecipeResult(state)
    if (!results) return

    const result = results[0]
    if (!result) return

    let item: Item | undefined = undefined

    const isPotion = isPotionItem(result)
    if (isPotion) item = result.uiCraftedItem
    else if (result.craftedItem) item = result.craftedItem
    else if (result.stdItemId) item = StdItems[result.stdItemId]

    return item
}
