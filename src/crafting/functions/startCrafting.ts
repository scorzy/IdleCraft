import { ActivityAdapter, ActivityTypes } from '../../activities/ActivityState'
import { ActivityStartResult } from '../../activities/activityInterfaces'
import { makeStartActivity } from '../../activities/functions/makeStartActivity'
import { GameState } from '../../game/GameState'
import { startTimer } from '../../timers/startTimer'
import { Crafting } from '../CraftingIterfaces'
import { getCraftingActivity } from '../CraftingSelectors'
import { recipes } from '../Recipes'
import { isCraftable } from './canCraft'

export const startCrafting = makeStartActivity((state: GameState, id: string) => {
    const data = getCraftingActivity(state, id)
    const recipe = recipes.getEx(data.recipeId)
    const craftResult = recipe.getResult(state, data.paramsValue)
    if (!craftResult) return { state, result: ActivityStartResult.NotPossible }
    if (!isCraftable(state, craftResult)) return { state, result: ActivityStartResult.NotPossible }

    const up: Partial<Crafting> = { result: craftResult }
    state = {
        ...state,
        activities: ActivityAdapter.update(state.activities, id, up),
    }

    state = startTimer(state, craftResult.time, ActivityTypes.Crafting, id)

    return { state, result: ActivityStartResult.Started }
})
