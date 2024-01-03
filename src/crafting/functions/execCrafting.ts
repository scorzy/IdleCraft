import { ActivityStartResult } from '../../activities/activityInterfaces'
import { makeExecActivity } from '../../activities/functions/makeExecActivity'
import { addExp } from '../../experience/expFunctions'
import { GameState } from '../../game/GameState'
import { addItem, saveCraftItem } from '../../storage/storageFunctions'
import { Timer } from '../../timers/Timer'
import { CraftingAdapter } from '../CraftingAdapter'
import { RecipeData } from '../RecipeData'
import { recipes } from '../Recipes'
import { isCraftable } from './canCraft'

export const execCrafting = makeExecActivity((state: GameState, timer: Timer) => {
    const id = timer.actId
    const data = CraftingAdapter.selectEx(state.crafting, id)
    const recipe = recipes.getEx(data.recipeId)

    const craftResult = data.result
    if (!isCraftable(state, craftResult)) return { state, result: ActivityStartResult.NotPossible }

    for (const req of craftResult.requirements) {
        if (req.stdItemId) state = addItem(state, req.stdItemId, null, req.qta * -1)
        if (req.craftedItemId) state = addItem(state, null, req.craftedItemId, req.qta * -1)
    }

    if (craftResult.results.stdItemId)
        state = addItem(state, craftResult.results.stdItemId, null, craftResult.results.qta)
    else if (craftResult.results.craftedItem) {
        const { id, state: craftedItems } = saveCraftItem(state.craftedItems, craftResult.results.craftedItem)
        state = { ...state, craftedItems }
        state = addItem(state, null, id, craftResult.results.qta)
    }

    state = addExp(state, RecipeData[recipe.type].expType, 10)

    return { state, result: ActivityStartResult.Ended }
})
