import { GameState } from '../../game/GameState'
import { Timer } from '../../timers/Timer'
import { startNextActivity } from '../activityFunctions'
import { ActivityStartResult } from '../activityInterfaces'
import { removeActivityInt } from './removeActivity'

export const makeExecActivity =
    (fun: (state: GameState, timer: Timer) => { state: GameState; result: ActivityStartResult }) =>
    (state: GameState, timer: Timer) => {
        const { state: state2, result } = fun(state, timer)
        state = state2
        const id = timer.actId
        if (!id) return state

        if (result === ActivityStartResult.NotPossible) {
            state = removeActivityInt(state, id)
        } else if (result === ActivityStartResult.Ended) {
            state = {
                ...state,
                activityDone: state.activityDone + 1,
                activityId: id,
                lastActivityDone: state.orderedActivities.indexOf(id),
            }
        }
        if (result !== ActivityStartResult.Started) state = startNextActivity(state)
        return state
    }
