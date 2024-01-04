import { GameState } from '../../game/GameState'
import { Timer } from '../../timers/Timer'
import { ActivityStartResult } from '../activityInterfaces'
import { endActivity } from './endActivity'

export const makeExecActivity =
    (fun: (state: GameState, timer: Timer) => { state: GameState; result: ActivityStartResult }) =>
    (state: GameState, timer: Timer) => {
        const { state: state2, result } = fun(state, timer)
        state = state2
        const id = timer.actId
        if (!id) return state

        state = endActivity(state, id, result)
        return state
    }
