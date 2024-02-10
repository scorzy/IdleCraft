import { onTimer } from '../timers/onTimer'
import { getFirstTimer } from '../timers/getFirstTimer'
import { adapterFunctions } from '../entityAdapter/AdapterFunctions'
import { GameState, Globals } from './GameState'
import { regenerate } from './regenerate'
import { MAX_LOAD } from './const'
import { advanceTimers } from './advanceTimers'

export const Running = { running: true }

export function loadGame(state: GameState, sendProgress: boolean): GameState {
    adapterFunctions.setMutable()
    try {
        state.loading = true
        let diff = Date.now() - state.now - MAX_LOAD
        if (diff > 0) state = advanceTimers(state, diff)

        const now = Math.min(state.now + MAX_LOAD, Date.now())
        Globals.loadTo = now

        const toLoad = now - state.now

        for (const id of state.timers.ids) {
            const timer = state.timers.entries[id]
            if (timer) timer.intervalId = undefined
        }

        let lastProgress = 0
        let timer = getFirstTimer(state.timers, now)
        while (timer) {
            state = onTimer(state, timer.id)
            state.now = timer.to
            timer = getFirstTimer(state.timers, now)

            if (sendProgress) {
                if (!Running.running) throw new Error('Interrupted')
                let progress = Math.floor(100 - (100 * (now - state.now)) / toLoad)
                progress = Math.floor(Math.floor(progress / 5) * 5)
                if (progress > lastProgress) {
                    lastProgress = progress
                    postMessage({ gameId: state.gameId, progress })
                }
            }
        }

        diff = Date.now() - state.now
        if (diff > 0) state = advanceTimers(state, diff)

        state = regenerate(state, state.now)

        state.loading = false
    } finally {
        adapterFunctions.setImmutable()
    }
    return state
}
