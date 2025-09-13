import { GameState } from '../GameState'
import { initialize } from '../initialize'
import { loadGame } from './loadGame'

onmessage = (e) => {
    initialize()
    const state = e.data as GameState
    loadGame(state)
    postMessage({ state })
}
