import { makeRemoveActivity } from '../../activities/functions/makeRemoveActivity'
import { GameState } from '../../game/GameState'
import { CraftingAdapter } from '../CraftingAdapter'

export const removeCrafting = makeRemoveActivity((state: GameState, activityId: string) => {
    return { ...state, crafting: CraftingAdapter.remove(state.crafting, activityId) }
})
