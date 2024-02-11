import { GameState } from '../GameState'

export function advanceTimers(state: GameState, diff: number): GameState {
    state.now += diff
    for (const id of state.timers.ids) {
        const timer = state.timers.entries[id]
        if (timer) {
            timer.from += diff
            timer.to += diff
        }
    }
    return state
}
