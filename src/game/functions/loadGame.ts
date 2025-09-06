import { onTimer } from '../../timers/onTimer'
import { getFirstTimer } from '../../timers/getFirstTimer'
import { GameState } from '../GameState'
import { TEST_DIF, MAX_LOAD } from '../const'
import { advanceTimers } from './advanceTimers'

export function loadGame(state: GameState): GameState {
    const start = Date.now()
    let lastReport = 0

    if (TEST_DIF !== 0) {
        state = advanceTimers(state, TEST_DIF)
        state.lastRegen += TEST_DIF
    }

    state.loading = true
    const diff = Date.now() - state.now - MAX_LOAD
    if (diff > 0) state = advanceTimers(state, diff)

    const gameStart = state.now
    const end = Math.min(state.now + MAX_LOAD, Date.now())

    for (const id of state.timers.ids) {
        const timer = state.timers.entries[id]
        if (timer) timer.intervalId = undefined
    }

    let timer = getFirstTimer(state.timers, end)
    while (timer) {
        state = onTimer(state, timer.id)
        state.now = timer.to
        timer = getFirstTimer(state.timers, end)

        if (Date.now() - lastReport > 100) {
            lastReport = Date.now()
            const percent = Math.floor((100 * (state.now - gameStart)) / (end - gameStart))
            state.loadingData = { loading: true, start: gameStart, now: state.now, end, percent }
            postMessage({ state })
        }
    }
    state.loading = false
    state.loadingData = undefined
    const endDate = Date.now()
    console.log(`Load time: ${endDate - start}ms`)

    return state
}
