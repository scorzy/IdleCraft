import { useUiTempStore } from '../../ui/state/uiTempStore'
import { GameState } from '../GameState'
import { GetInitialGameState } from '../InitialGameState'
import { loadData } from '../loadData'
import { WorkerMessage } from '../loadWorkerTypes'
import { setState } from '../setState'
import { useGameStore } from '../state'
import { MAX_LOAD } from '../const'
import { regenerate } from './regenerate'
import { advanceTimers } from './advanceTimers'

// eslint-disable-next-line import/default
import LoadWorker from './loadWorker?worker'

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
    useGameStore.setState(structuredClone(state))
}

export const load = (data: object) => {
    worker = new LoadWorker()
    worker.onmessage = (e: MessageEvent<WorkerMessage>) => {
        console.log(e.data)
        if (e.data.state) start(e.data.state)
        if (e.data.loadingData) useUiTempStore.setState({ loadingData: e.data.loadingData })
    }
    const state = loadData(data)
    state.loading = true
    const end = Math.min(state.now + MAX_LOAD, Date.now())
    const loadingData = { loading: true, start: state.now, now: state.now, end, percent: 0 }
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
    setState((state) => start(state))
}
