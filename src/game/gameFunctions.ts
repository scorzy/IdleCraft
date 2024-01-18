import { onTimer } from '../timers/onTimer'
import { execTimer } from '../timers/timerFunctions'
import { getFirstTimer } from '../timers/getFirstTimer'
import { GameState, Globals } from './GameState'
import { loadData } from './loadData'
import { useGameStore } from './state'
import { regenerate } from './regenerate'

const MAX_LOAD = 3600 * 1000 * 24 * 1
//const TEST_DIF = -3600 * 1000 * 24 * 360
const TEST_DIF: number = 0

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export declare function setTimeout(this: Window | void, handler: (...args: unknown[]) => void, timeout: number): number

export const load = (data: object) => {
    let state = loadData(data)
    state = loadGame(state)
    useGameStore.setState(state)
}

function advanceTimers(state: GameState, diff: number): GameState {
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

function loadGame(state: GameState): GameState {
    if (TEST_DIF !== 0) {
        state = advanceTimers(state, TEST_DIF)
        state.lastRegen += TEST_DIF
    }

    state.loading = true
    let diff = Date.now() - state.now - MAX_LOAD
    if (diff > 0) state = advanceTimers(state, diff)

    const now = Math.min(state.now + MAX_LOAD, Date.now())
    Globals.loadTo = now

    for (const id of state.timers.ids) {
        const timer = state.timers.entries[id]
        if (timer) timer.intervalId = undefined
    }

    let timer = getFirstTimer(state.timers, now)
    while (timer) {
        state = onTimer(state, timer.id)
        state.now = timer.to
        timer = getFirstTimer(state.timers, now)
    }

    for (const id of state.timers.ids) {
        const timer = state.timers.entries[id]
        if (!timer) continue
        if (timer.intervalId && timer.intervalId > 0) continue

        const diff = Math.max(timer.to - state.now, 0)
        timer.intervalId = setTimeout(() => execTimer(id), diff)
    }

    diff = Date.now() - state.now
    if (diff > 0) state = advanceTimers(state, diff)

    state = regenerate(state, state.now)

    state.loading = false
    return state
}
