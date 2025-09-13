import { GameState } from '../../game/GameState'
import { Timer } from '../../timers/Timer'
import { ActivityStartResult } from '../activityInterfaces'
import { endActivity } from './endActivity'

export const makeExecActivity =
    (fun: (state: GameState, timer: Timer) => ActivityStartResult) => (state: GameState, timer: Timer) => {
        const result = fun(state, timer)

        const id = timer.actId
        if (!id) return

        endActivity(state, id, result)
    }
