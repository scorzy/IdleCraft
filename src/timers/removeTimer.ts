import { GameState } from '../game/GameState'
import { TimerAdapter } from './Timer'

export function removeTimer(state: GameState, timerId: string): GameState {
    const timer = TimerAdapter.select(state.timers, timerId)
    if (!timer) return state

    if (timer.intervalId) clearInterval(timer.intervalId)

    state = { ...state, timers: TimerAdapter.remove(state.timers, timerId) }
    return state
}
