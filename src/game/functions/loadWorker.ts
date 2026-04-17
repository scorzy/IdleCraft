import { initialize } from './initialize'
import { loadGame } from './loadGame'

// biome-ignore lint/suspicious/noGlobalAssign: worker
onmessage = (e) => {
    initialize()
    const state = e.data // GameState
    loadGame(state)
    postMessage({ state, loadingData: undefined })
}
