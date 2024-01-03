import { ActivityTypes } from '../../activities/ActivityState'
import { makeAddActivity } from '../../activities/functions/makeAddActivity'
import { GameState } from '../../game/GameState'
import { useGameStore } from '../../game/state'
import { CraftingAdapter } from '../CraftingAdapter'
import { Crafting } from '../CraftingIterfaces'

const makeCrafting = makeAddActivity(ActivityTypes.Crafting, (state: GameState, activityId: string) => {
    if (!state.craftingForm.result) return state

    const data: Crafting = {
        activityId,
        recipeId: state.recipeId,
        paramsValue: state.craftingForm.paramsValue,
        result: state.craftingForm.result,
    }

    state = { ...state, crafting: CraftingAdapter.create(state.crafting, data) }
    return state
})

export const addCrafting = () => useGameStore.setState(makeCrafting)
