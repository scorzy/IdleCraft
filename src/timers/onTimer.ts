import { GameState } from '../game/GameState'
import { activityExecutors } from '../game/globals'
import { TimerAdapter } from './Timer'

export function onTimer(state: GameState, timerId: string) {
    const timer = state.timers.entries[timerId]
    if (!timer) return state

    state = { ...state, now: Math.max(state.now, timer.to), timers: TimerAdapter.remove(state.timers, timerId) }

    const actId = timer.actId
    if (!actId) return state

    state = activityExecutors.getEx(timer.type)(state, timer)

    return state
}
