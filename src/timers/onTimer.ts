import { execActivityOnTimer, startNextActivity } from '../activities/activityFunctions'
import { GameState } from '../game/GameState'
import { growTree } from '../wood/forest/forestFunctions'
import { TimerAdapter, TimerTypes } from './Timer'

export function onTimer(state: GameState, timerId: string) {
    const timer = state.timers.entries[timerId]
    if (timer === undefined) return state

    state = { ...state, timers: TimerAdapter.remove(state.timers, timerId) }

    const actId = timer.actId
    if (actId) {
        if (timer.type === TimerTypes.Tree) {
            state = growTree(state, actId)
            if (state.waitingTrees === state.activityId) state = startNextActivity(state)

            return state
        }

        state = execActivityOnTimer(state, actId)
    }

    return state
}
