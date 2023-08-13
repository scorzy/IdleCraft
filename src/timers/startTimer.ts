import { GameState } from '../game/GameState'
import { getUniqueId } from '../utils/getUniqueId'
import { Timer, TimerAdapter, TimerTypes } from './Timer'
import { execTimer } from './timerFunctions'

export declare function setTimeout(this: Window | void, handler: (...args: unknown[]) => void, timeout: number): number
export declare function setTimeout(this: Window | void, handler: unknown, timeout?: unknown, ...args: unknown[]): number

export function startTimer(
    state: GameState,
    length: number,
    type: TimerTypes,
    actId: string,
    data?: unknown
): GameState {
    let end = state.now + length
    let intervalId = 0
    const id = getUniqueId()

    if (!state.loading) {
        state = { ...state, now: Date.now() }
        end = state.now + length
        const diff = Math.max(end - state.now, 0)
        intervalId = setTimeout(() => execTimer(id), diff)
    }

    const timer: Timer = { id, from: state.now, to: end, intervalId, type, actId, data }

    state = {
        ...state,
        timers: TimerAdapter.create(state.timers, timer),
    }

    return state
}
