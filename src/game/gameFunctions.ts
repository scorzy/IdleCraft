import { execTimer } from '../timers/timerFunctions'
import { GameState } from './GameState'
import { loadGame } from './loadGame'
import { useGameStore } from './state'

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export declare function setTimeout(this: Window | void, handler: (...args: unknown[]) => void, timeout: number): number

export const load = (state: GameState) => {
    state = loadGame(state, false)
    for (const id of state.timers.ids) {
        const timer = state.timers.entries[id]
        if (!timer) continue
        if (timer.intervalId && timer.intervalId > 0) continue

        const diff = Math.max(timer.to - state.now, 0)
        timer.intervalId = setTimeout(() => execTimer(id), diff)
    }
    state = structuredClone(state)
    console.log(state)
    useGameStore.setState(state)
}
