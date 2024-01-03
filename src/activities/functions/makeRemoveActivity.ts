import { GameState } from '../../game/GameState'
import { removeActivityTimers } from '../../timers/removeActivityTimers'
import { ActivityAdapter } from '../ActivityState'
import { startNextActivity } from '../activityFunctions'

export const makeRemoveActivity =
    (onRemove: (state: GameState, activityId: string) => GameState) => (state: GameState, activityId: string) => {
        const isCurrent = state.activityId === activityId
        state = onRemove(state, activityId)

        const lastActivityDone =
            state.lastActivityDone >= state.orderedActivities.indexOf(activityId)
                ? Math.max(0, state.lastActivityDone - 1)
                : state.lastActivityDone
        const activities = ActivityAdapter.remove(state.activities, activityId)

        state = {
            ...state,
            activities,
            lastActivityDone,
            activityId: activityId === state.activityId ? null : state.activityId,
            orderedActivities: state.orderedActivities.filter((id) => id !== activityId),
        }
        state = removeActivityTimers(state, activityId)
        if (isCurrent) state = startNextActivity(state)

        return state
    }
