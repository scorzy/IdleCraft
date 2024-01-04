import { GameState } from '../../game/GameState'
import { startNextActivity } from '../activityFunctions'
import { ActivityStartResult } from '../activityInterfaces'
import { removeActivityInt } from './removeActivity'

export function endActivity(state: GameState, activityId: string, result: ActivityStartResult): GameState {
    if (result === ActivityStartResult.NotPossible) state = removeActivityInt(state, activityId)
    else if (result === ActivityStartResult.Ended) {
        state = {
            ...state,
            activityDone: state.activityDone + 1,
            activityId,
            lastActivityDone: state.orderedActivities.indexOf(activityId),
        }
    }
    if (result !== ActivityStartResult.Started) state = startNextActivity(state)

    return state
}
