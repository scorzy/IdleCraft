import { useUiTempStore } from '../../ui/state/uiTempStore'
import { GetInitialGameState } from '../InitialGameState'
import { loadData } from '../loadData'
import { WorkerMessage } from '../loadWorkerTypes'
import { useGameStore } from '../state'
import { MAX_LOAD, TEST_DIF } from '../const'
import { GameState } from '../GameState'
import { regenerate } from './regenerate'
import { advanceTimers } from './advanceTimers'

// eslint-disable-next-line import/default
import LoadWorker from './loadWorker?worker'

let worker = new LoadWorker()
let tempState: GameState

function createWorker() {
    worker = new LoadWorker()
    worker.onmessage = (e: MessageEvent<WorkerMessage>) => {
        if (e.data.loadingData) useUiTempStore.setState({ loadingData: e.data.loadingData })
        else if (e.data.state) start(e.data.state)
        if (e.data.state) tempState = e.data.state
    }
}

createWorker()

function killWorker() {
    if (worker) worker.terminate()

    createWorker()
}

function start(state: GameState): void {
    const diff = Date.now() - state.now
    if (diff > 0) advanceTimers(state, diff)
    regenerate(state, state.now)
    state.loading = false
    useGameStore.setState(structuredClone(state))
}

export const load = (data: object) => {
    const state = loadData(data)
    state.loading = true
    const now = state.now + TEST_DIF
    const end = Math.min(now + MAX_LOAD, Date.now())
    const loadingData = { loading: true, start: now, now: now, end, percent: 0 }
    useUiTempStore.setState({ loadingData })
    useGameStore.setState(structuredClone(state))
    worker.postMessage(state)
}
export const stopLoad = () => {
    killWorker()
    useGameStore.setState(GetInitialGameState())
}
export const startAnyway = () => {
    killWorker()
    if (tempState) start(tempState)
}
