import { GameState } from '../GameState'

export type WorkerRequest = { type: 'EXPORT'; payload: GameState } | { type: 'IMPORT'; payload: string }

export type WorkerResponse =
    | { type: 'EXPORT_SUCCESS'; payload: string }
    | { type: 'IMPORT_SUCCESS'; payload: GameState }
    | { type: 'ERROR'; error: string }
