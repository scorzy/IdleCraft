import { GameState } from './GameState'
import { advanceTimers } from './advanceTimers'
import { TEST_DIF } from './const'
import { initialize } from './initialize'
import { loadData } from './loadData'
import { Running, loadGame } from './loadGame'

initialize()

onmessage = (e) => {
    const data: { kill?: boolean; toLoad?: GameState } = e.data as { kill: boolean } | { toLoad: GameState }
    if ('kill' in data && data.kill) {
        Running.running = false
        return
    }

    if (!('toLoad' in data)) return
    let state = data.toLoad
    if (!state) return

    const gameId = state.gameId
    try {
        state = loadData(state)

        if (TEST_DIF !== 0) {
            state = advanceTimers(state, TEST_DIF)
            state.lastRegen += TEST_DIF
        }

        const result = loadGame(state, true)

        postMessage({ gameId, loadedState: result })
    } catch (e: unknown) {
        let error = `Unknown error`
        if (e instanceof Error) error = e.message
        postMessage({ gameId, error })
    }
}
