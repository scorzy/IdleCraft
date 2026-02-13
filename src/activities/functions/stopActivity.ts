import { GameState } from '../../game/GameState'
import { removeActivityTimers } from '../../timers/removeActivityTimers'

export const stopActivity = (state: GameState, activityId: string) => {
    const lastActivityDone =
        state.lastActivityDone >= state.orderedActivities.indexOf(activityId)
            ? Math.max(0, state.lastActivityDone - 1)
            : state.lastActivityDone

    state.lastActivityDone = lastActivityDone
    state.activityId = activityId === state.activityId ? null : state.activityId

    removeActivityTimers(state, activityId)
}
