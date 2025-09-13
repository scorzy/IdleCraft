import { ActivityTypes } from '../../activities/ActivityState'
import { ActivityStartResult } from '../../activities/activityInterfaces'
import { makeStartActivity } from '../../activities/functions/makeStartActivity'
import { GameState } from '../../game/GameState'
import { startTimer } from '../../timers/startTimer'
import { getCraftingActivity } from '../CraftingSelectors'
import { recipes } from '../Recipes'
import { isCraftable } from '../selectors/canCraft'

export const startCrafting = makeStartActivity((state: GameState, id: string) => {
    const data = getCraftingActivity(state, id)
    const recipe = recipes.getEx(data.recipeId)
    const craftResult = recipe.getResult(state, data.paramsValue)
    if (!craftResult) return ActivityStartResult.NotPossible
    if (!isCraftable(state, craftResult)) return ActivityStartResult.NotPossible

    data.result = craftResult

    startTimer(state, craftResult.time, ActivityTypes.Crafting, id)

    return ActivityStartResult.Started
})
