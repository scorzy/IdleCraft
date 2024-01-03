import { GameState } from '../game/GameState'
import { activityExecutors } from '../game/globals'
import { TimerAdapter } from './Timer'

export function onTimer(state: GameState, timerId: string) {
    const timer = state.timers.entries[timerId]
    if (!timer) return state

    state = { ...state, timers: TimerAdapter.remove(state.timers, timerId) }

    const actId = timer.actId
    if (!actId) return state

    const exec = activityExecutors.get(timer.type)
    if (!exec) throw new Error(`[onTimer] timer type not found ${timer.type}`)
    state = exec(state, timer)

    return state
}
