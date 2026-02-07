import { GameState } from '../../game/GameState'
import { startNextActivity } from '../activityFunctions'
import { ActivityStartResult } from '../activityInterfaces'
import { ActivityAdapter } from '../ActivityState'
import { removeActivityInt } from './removeActivity'

export function endActivity(state: GameState, activityId: string, result: ActivityStartResult) {
    if (result === ActivityStartResult.NotPossible) removeActivityInt(state, activityId)
    else if (result === ActivityStartResult.Ended) {
        state.activityDone += 1
        state.activityId = activityId
        state.lastActivityDone = state.orderedActivities.indexOf(activityId)
        const activity = ActivityAdapter.select(state.activities, activityId)
        if (activity && activity.remove && activity.max >= state.activityDone) removeActivityInt(state, activityId)
    }
    if (result !== ActivityStartResult.Started) startNextActivity(state)
}
