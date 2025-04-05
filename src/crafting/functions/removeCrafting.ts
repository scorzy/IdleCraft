import { ActivityAdapter } from '../../activities/ActivityState'
import { makeRemoveActivity } from '../../activities/functions/makeRemoveActivity'
import { GameState } from '../../game/GameState'

export const removeCrafting = makeRemoveActivity((state: GameState, activityId: string) => {
    return { ...state, activities: ActivityAdapter.remove(state.activities, activityId) }
})
