import { onTimer } from '../../timers/onTimer'
import { getFirstTimer } from '../../timers/getFirstTimer'
import { GameState } from '../GameState'
import { TEST_DIF, MAX_LOAD } from '../const'
import { advanceTimers } from './advanceTimers'

export function loadGame(state: GameState): void {
    const start = Date.now()
    let lastReport = 0

    if (TEST_DIF !== 0) {
        advanceTimers(state, TEST_DIF)
        state.lastRegen += TEST_DIF
    }

    state.loading = true
    const diff = Date.now() - state.now - MAX_LOAD
    if (diff > 0) advanceTimers(state, diff)

    const gameStart = state.now
    const end = Math.min(state.now + MAX_LOAD, Date.now())

    let timer = getFirstTimer(state.timers, end)
    while (timer) {
        onTimer(state, timer.id)
        state.now = timer.to
        timer = getFirstTimer(state.timers, end)

        const now = Date.now()
        if (now - lastReport > 150) {
            lastReport = now
            const percent = Math.floor((100 * (state.now - gameStart)) / (end - gameStart))
            const loadingData = { loading: true, start: gameStart, now: state.now, end, percent }
            postMessage({ state, loadingData })
        }
    }
    state.loading = false
    const endLoad = Date.now()
    if (import.meta.env.DEV) console.log(`Load time: ${endLoad - start}ms`)
}
