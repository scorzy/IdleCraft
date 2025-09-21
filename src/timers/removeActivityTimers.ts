import { GameState } from '../game/GameState'
import { TimerAdapter } from './Timer'

export function removeActivityTimers(state: GameState, activityId: string): void {
    const timers = state.timers

    for (const id of timers.ids) {
        const timer = TimerAdapter.select(timers, id)
        if (timer && activityId === timer.actId) TimerAdapter.remove(timers, id)
    }
}
