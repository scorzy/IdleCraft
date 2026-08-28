import { ActivityTypes } from '../../activities/ActivityState'
import { ActivityStartResult } from '../../activities/activityInterfaces'
import { makeStartActivity } from '../../activities/functions/makeStartActivity'
import { GameState } from '../../game/GameState'
import { startTimer } from '../../timers/startTimer'
import { getCraftingActivity, getRecipeResult } from '../CraftingSelectors'
import { isCraftable } from '../selectors/canCraft'
import { purchaseCraftingRequirements } from './autoBuyCrafting'

export const startCrafting = makeStartActivity((state: GameState, id: string) => {
    const data = getCraftingActivity(state, id)
    const craftResult = getRecipeResult(state, data.recipeId, data.paramsValue)
    if (!craftResult) return ActivityStartResult.NotPossible
    if (!purchaseCraftingRequirements(state, craftResult, data.autoBuy ?? {})) return ActivityStartResult.NotPossible
    if (!isCraftable(state, craftResult)) return ActivityStartResult.NotPossible

    startTimer(state, craftResult.time, ActivityTypes.Crafting, id)

    return ActivityStartResult.Started
})
