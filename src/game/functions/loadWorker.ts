import { initialize } from './initialize'
import { loadGame } from './loadGame'

onmessage = (e) => {
    initialize()
    const state = e.data // GameState
    loadGame(state)
    postMessage({ state, loadingData: undefined })
}
