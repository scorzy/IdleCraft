import { ActivityStartResult } from '../../activities/activityInterfaces'
import { ActivityAdapter } from '../../activities/ActivityState'
import { makeExecActivity } from '../../activities/functions/makeExecActivity'
import { addExp } from '../../experience/expFunctions'
import { GameState } from '../../game/GameState'
import { addItem, removeItem, saveCraftItem } from '../../storage/storageFunctions'
import { Timer } from '../../timers/Timer'
import { isCrafting } from '../CraftingIterfaces'
import { RecipeData } from '../RecipeData'
import { recipes } from '../Recipes'
import { isCraftable } from '../selectors/canCraft'

export const execCrafting = makeExecActivity((state: GameState, timer: Timer) => {
    const id = timer.actId

    const data = ActivityAdapter.selectEx(state.activities, id)
    if (!data) {
        console.error(`[execCrafting] data not found ${timer.actId}`)
        return ActivityStartResult.NotPossible
    }

    if (!isCrafting(data)) throw new Error(`Activity ${id} is not a crafting activity`)

    const recipe = recipes.getEx(data.recipeId)

    const craftResult = data.result
    if (!isCraftable(state, craftResult)) return ActivityStartResult.NotPossible

    for (const req of craftResult.requirements) removeItem(state, req.itemId, req.qta)

    for (const res of craftResult.results) {
        if (res.stdItemId) addItem(state, res.stdItemId, res.qta)
        else if (res.craftedItem) {
            const { id } = saveCraftItem(state.craftedItems, res.craftedItem)
            addItem(state, id, res.qta)
        }
    }

    addExp(state, RecipeData[recipe.type].expType, 10)

    if (recipe.afterCrafting) recipe.afterCrafting(state, data.paramsValue, data.result)

    return ActivityStartResult.Ended
})
