import { GameState } from '../GameState'
import { GetInitialGameState } from '../InitialGameState'
import { loadData } from '../loadData'
import { WorkerMessage } from '../loadWorkerTypes'
import { regenerate } from '../regenerate'
import { useGameStore } from '../state'
import { advanceTimers } from './advanceTimers'
// eslint-disable-next-line import/default
import LoadWorker from './loadWorker?worker'
import { startTimers } from './startTimers'

let worker: Worker | undefined

function killWorker() {
    if (worker) {
        worker.terminate()
        worker = undefined
    }
}

function start(state: GameState): GameState {
    const diff = Date.now() - state.now
    if (diff > 0) state = advanceTimers(state, diff)
    state = regenerate(state, state.now)
    state.loading = false
    state.loadingData = undefined
    state = startTimers(state)
    return state
}

export const load = (data: object) => {
    worker = new LoadWorker()
    worker.onmessage = (e: MessageEvent<WorkerMessage>) => {
        let state: GameState = e.data.state
        if (!state.loading) state = start(state)
        useGameStore.setState(state)
    }
    const state = loadData(data)
    state.loading = true
    state.loadingData = undefined
    useGameStore.setState(structuredClone(state))
    worker.postMessage(state)
}
export const stopLoad = () => {
    killWorker()
    useGameStore.setState(GetInitialGameState())
}
export const startAnyway = () => {
    killWorker()
    useGameStore.setState((state) => start(state))
}
