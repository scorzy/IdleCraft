import { GameState } from '../GameState'
import { initialize } from '../initialize'
import { loadGame } from './loadGame'

onmessage = (e) => {
    initialize()
    const state = loadGame(e.data as GameState)
    postMessage({ state })
}
