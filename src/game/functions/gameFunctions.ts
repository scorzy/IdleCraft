import { GameState } from '../GameState'
import { GetInitialGameState } from '../InitialGameState'
import { loadData } from '../loadData'
import { WorkerMessage } from '../loadWorkerTypes'
import { regenerate } from '../regenerate'
import { setState, useGameStore } from '../state'
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

function start(state: GameState): void {
    const diff = Date.now() - state.now
    if (diff > 0) advanceTimers(state, diff)
    regenerate(state, state.now)
    state.loading = false
    state.loadingData = undefined
    startTimers(state)
}

export const load = (data: object) => {
    worker = new LoadWorker()
    worker.onmessage = (e: MessageEvent<WorkerMessage>) => {
        const state: GameState = e.data.state
        if (!state.loading) start(state)
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
    setState((state) => start(state))
}
