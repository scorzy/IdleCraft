import { ActivityTypes } from '../activities/ActivityState'
import { GameState } from '../game/GameState'
import { getUniqueId } from '../utils/getUniqueId'
import { Timer, TimerAdapter } from './Timer'
import { execTimer } from './timerFunctions'

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export declare function setTimeout(this: Window | void, handler: (...args: unknown[]) => void, timeout: number): number
export function startTimer(state: GameState, length: number, type: ActivityTypes, actId: string): void {
    let end = state.now + length
    let intervalId = 0
    const id = getUniqueId()

    if (!state.loading) {
        if (!state.loading && !state.isTimer) state.now = Date.now()
        end = state.now + length
        const diff = Math.max(end - Date.now(), 0)
        intervalId = setTimeout(() => execTimer(id), diff)
    }

    const timer: Timer = { id, from: state.now, to: end, intervalId, type, actId }

    TimerAdapter.create(state.timers, timer)
}
