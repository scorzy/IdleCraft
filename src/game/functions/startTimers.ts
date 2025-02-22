import { execTimer } from '../../timers/timerFunctions'
import { GameState } from '../GameState'

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
declare function setTimeout(this: Window | void, handler: (...args: unknown[]) => void, timeout: number): number

export function startTimers(state: GameState): GameState {
    for (const id of state.timers.ids) {
        const timer = state.timers.entries[id]
        if (!timer) continue
        if (timer.intervalId && timer.intervalId > 0) continue

        const diff = Math.max(timer.to - state.now, 0)
        timer.intervalId = setTimeout(() => execTimer(id), diff)
    }
    return state
}
