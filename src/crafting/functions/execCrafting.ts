import { ActivityStartResult } from '../../activities/activityInterfaces'
import { makeExecActivity } from '../../activities/functions/makeExecActivity'
import { addExp } from '../../experience/expFunctions'
import { GameState } from '../../game/GameState'
import { addItem, saveCraftItem } from '../../storage/storageFunctions'
import { Timer } from '../../timers/Timer'
import { getCraftingActivity } from '../CraftingSelectors'
import { RecipeData } from '../RecipeData'
import { recipes } from '../Recipes'
import { isCraftable } from '../selectors/canCraft'

export const execCrafting = makeExecActivity((state: GameState, timer: Timer) => {
    const id = timer.actId
    const data = getCraftingActivity(state, id)

    const recipe = recipes.getEx(data.recipeId)

    const craftResult = data.result
    if (!isCraftable(state, craftResult)) return ActivityStartResult.NotPossible

    for (const req of craftResult.requirements) addItem(state, req.itemId, req.qta * -1)

    for (const res of craftResult.results) {
        if (res.stdItemId) addItem(state, res.stdItemId, res.qta)
        else if (res.craftedItem) {
            const { id } = saveCraftItem(state.craftedItems, res.craftedItem)

            addItem(state, id, res.qta)
        }
    }
    addExp(state, RecipeData[recipe.type].expType, 10)

    return ActivityStartResult.Ended
})
