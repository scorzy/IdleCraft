import { ActivityTypes } from '../activities/ActivityState'
import { GameState, Globals } from '../game/GameState'
import { getUniqueId } from '../utils/getUniqueId'
import { Timer, TimerAdapter } from './Timer'
import { execTimer } from './timerFunctions'

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export declare function setTimeout(this: Window | void, handler: (...args: unknown[]) => void, timeout: number): number

export function startTimer(state: GameState, length: number, type: ActivityTypes, actId: string): GameState {
    let end = state.now + length
    let intervalId = 0
    const id = getUniqueId()

    if (!state.loading || Globals.loadTo > end) {
        if (!state.loading) state = { ...state, now: Date.now() }
        end = state.now + length
        const diff = Math.max(end - state.now, 0)
        if (!state.loading) intervalId = setTimeout(() => execTimer(id), diff)
    }

    const timer: Timer = { id, from: state.now, to: end, intervalId, type, actId }

    state = {
        ...state,
        timers: TimerAdapter.create(state.timers, timer),
    }

    return state
}
