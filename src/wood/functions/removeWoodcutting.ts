import { makeRemoveActivity } from '../../activities/functions/makeRemoveActivity'
import { GameState } from '../../game/GameState'
import { WoodcuttingAdapter } from '../WoodcuttingAdapter'

export const removeWoodcutting = makeRemoveActivity((state: GameState, activityId: string) => {
    return { ...state, woodcutting: WoodcuttingAdapter.remove(state.woodcutting, activityId) }
})
