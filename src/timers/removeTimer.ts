import { GameState } from '../game/GameState'
import { TimerAdapter } from './Timer'

export function removeTimer(state: GameState, timerId: string): void {
    const timer = TimerAdapter.select(state.timers, timerId)
    if (!timer) return

    TimerAdapter.remove(state.timers, timerId)
}
