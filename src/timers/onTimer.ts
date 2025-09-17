import { GameState } from '../game/GameState'
import { activityExecutors } from '../game/globals'
import { regenerate } from '../game/functions/regenerate'
import { TimerAdapter } from './Timer'

export function onTimer(state: GameState, timerId: string): void {
    const timer = state.timers.entries[timerId]
    if (!timer) return

    state.now = Math.max(state.now, timer.to)
    TimerAdapter.remove(state.timers, timerId)

    const actId = timer.actId
    if (!actId) return

    regenerate(state, state.now)
    activityExecutors.getEx(timer.type)(state, timer)
}
