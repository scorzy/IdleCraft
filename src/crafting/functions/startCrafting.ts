import { ActivityTypes } from '../../activities/ActivityState'
import { ActivityStartResult } from '../../activities/activityInterfaces'
import { makeStartActivity } from '../../activities/functions/makeStartActivity'
import { GameState } from '../../game/GameState'
import { startTimer } from '../../timers/startTimer'
import { CraftingAdapter } from '../CraftingAdapter'
import { recipes } from '../Recipes'
import { isCraftable } from './canCraft'

export const startCrafting = makeStartActivity((state: GameState, id: string) => {
    const data = CraftingAdapter.selectEx(state.crafting, id)
    const recipe = recipes.getEx(data.recipeId)
    const craftResult = recipe.getResult(state, data.paramsValue)
    if (!craftResult) return { state, result: ActivityStartResult.NotPossible }
    if (!isCraftable(state, craftResult)) return { state, result: ActivityStartResult.NotPossible }

    state = {
        ...state,
        crafting: CraftingAdapter.update(state.crafting, id, { result: craftResult }),
    }

    state = startTimer(state, craftResult.time, ActivityTypes.Crafting, id)

    return { state, result: ActivityStartResult.Started }
})
