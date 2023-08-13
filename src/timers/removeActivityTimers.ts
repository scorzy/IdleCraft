import { GameState } from '../game/GameState'
import { TimerAdapter } from './Timer'

export function removeActivityTimers(state: GameState, activityId: string): GameState {
    let timers = state.timers

    for (const id of timers.ids) {
        const timer = TimerAdapter.select(timers, id)
        if (timer && activityId === timer.actId) {
            timers = TimerAdapter.remove(timers, id)
            if (timer.intervalId) clearInterval(timer.intervalId)
        }
    }

    state = { ...state, timers }
    return state
}
