import { onTimer } from '../timers/onTimer'
import { execTimer } from '../timers/timerFunctions'
import { getFirstTimer } from '../timers/getFirstTimer'
import { GameState, Globals } from './GameState'
import { loadData } from './loadData'
import { useGameStore } from './state'

const MAX_LOAD = 3600 * 1000 * 24 * 1
//const TEST_DIF = 3600 * 1000 * 24 * 360
const TEST_DIF = 0

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export declare function setTimeout(this: Window | void, handler: (...args: unknown[]) => void, timeout: number): number

export const load = (data: object) => {
    let state = loadData(data)
    state = loadGame(state)
    useGameStore.setState(state)
}

function loadGame(state: GameState): GameState {
    state.now = state.now - TEST_DIF
    for (const id of state.timers.ids) {
        const timer = state.timers.entries[id]
        if (timer) {
            timer.from -= TEST_DIF
            timer.to -= TEST_DIF
        }
    }

    state.loading = true
    const now = Math.min(state.now + MAX_LOAD, Date.now())
    Globals.loadTo = now

    if (state.timers.ids.length < 1) return state

    for (const id of state.timers.ids) {
        const timer = state.timers.entries[id]
        if (timer) timer.intervalId = undefined
    }

    let timer = getFirstTimer(state.timers, now)
    while (timer) {
        state.now = timer.to
        state = onTimer(state, timer.id)
        timer = getFirstTimer(state.timers, now)
    }
    if (state.now < now) state.now = now

    for (const id of state.timers.ids) {
        const timer = state.timers.entries[id]
        if (!timer) continue
        if (timer.intervalId) continue

        const diff = Math.max(timer.to - state.now, 0)
        timer.intervalId = setTimeout(() => execTimer(id), diff)
    }

    state.loading = false
    return state
}
