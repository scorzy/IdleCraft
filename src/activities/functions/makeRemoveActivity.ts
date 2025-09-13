import { GameState } from '../../game/GameState'
import { removeActivityTimers } from '../../timers/removeActivityTimers'
import { ActivityAdapter } from '../ActivityState'
import { startNextActivity } from '../activityFunctions'

export const makeRemoveActivity =
    (onRemove?: (state: GameState, activityId: string) => void) => (state: GameState, activityId: string) => {
        const isCurrent = state.activityId === activityId
        if (onRemove) onRemove(state, activityId)

        const lastActivityDone =
            state.lastActivityDone >= state.orderedActivities.indexOf(activityId)
                ? Math.max(0, state.lastActivityDone - 1)
                : state.lastActivityDone

        ActivityAdapter.remove(state.activities, activityId)

        state.lastActivityDone = lastActivityDone
        state.activityId = activityId === state.activityId ? null : state.activityId
        state.orderedActivities = state.orderedActivities.filter((id) => id !== activityId)

        removeActivityTimers(state, activityId)

        if (isCurrent) startNextActivity(state)
    }
