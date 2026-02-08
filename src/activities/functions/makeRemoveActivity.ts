import { GameState } from '../../game/GameState'
import { removeActivityTimers } from '../../timers/removeActivityTimers'
import { ActivityAdapter } from '../ActivityState'
import { startNextActivity } from '../activityFunctions'
import { stopActivity } from './stopActivity'

export const makeRemoveActivity =
    (onRemove?: (state: GameState, activityId: string) => void) => (state: GameState, activityId: string) => {
        const isCurrent = state.activityId === activityId
        if (onRemove) onRemove(state, activityId)

        stopActivity(state, activityId)
        state.orderedActivities = state.orderedActivities.filter((id) => id !== activityId)

        ActivityAdapter.remove(state.activities, activityId)

        removeActivityTimers(state, activityId)

        if (isCurrent) startNextActivity(state)
    }
