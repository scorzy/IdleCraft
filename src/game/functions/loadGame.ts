import { onTimer } from '../../timers/onTimer'
import { execTimer } from '../../timers/timerFunctions'
import { getFirstTimer } from '../../timers/getFirstTimer'
import { adapterFunctions } from '../../entityAdapter/AdapterFunctions'
import { GameState } from '../GameState'
import { regenerate } from '../regenerate'
import { TEST_DIF, MAX_LOAD } from '../const'
import { advanceTimers } from './advanceTimers'

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
declare function setTimeout(this: Window | void, handler: (...args: unknown[]) => void, timeout: number): number

export function loadGame(state: GameState): GameState {
    adapterFunctions.setMutable()
    try {
        if (TEST_DIF !== 0) {
            state = advanceTimers(state, TEST_DIF)
            state.lastRegen += TEST_DIF
        }

        state.loading = true
        let diff = Date.now() - state.now - MAX_LOAD
        if (diff > 0) state = advanceTimers(state, diff)

        const now = Math.min(state.now + MAX_LOAD, Date.now())

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
    } finally {
        adapterFunctions.setImmutable()
    }
    return structuredClone(state)
}
