import { GameState } from './GameState'

export interface WorkerMessage {
    state?: GameState
    loadingData?: {
        loading: boolean
        start: number
        now: number
        end: number
        percent: number
    }
}
