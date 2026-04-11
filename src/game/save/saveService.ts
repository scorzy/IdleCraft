import { GameState } from '../GameState'
import { WorkerRequest, WorkerResponse } from './saveWorkerTypes'
// eslint-disable-next-line import/default
import SaveWorker from './saveWorker.js?worker'

function estimateBase64DecodedBytes(value: string): number {
    const normalized = value.trim()
    if (normalized.length === 0) return 0
    const paddingChars = normalized.endsWith('==') ? 2 : normalized.endsWith('=') ? 1 : 0
    return Math.floor((normalized.length * 3) / 4) - paddingChars
}

class SaveService {
    private worker: Worker
    private pending: ((value: WorkerResponse) => void) | null = null

    constructor() {
        this.worker = new SaveWorker()
        this.worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
            if (!this.pending) return
            this.pending(event.data)
            this.pending = null
        }
    }

    private request(message: WorkerRequest): Promise<WorkerResponse> {
        if (this.pending) return Promise.reject(new Error('Save worker is busy'))

        return new Promise<WorkerResponse>((resolve) => {
            this.pending = resolve
            this.worker.postMessage(message)
        })
    }

    async exportSave(state: GameState): Promise<{ value: string; uncompressedBytes: number; compressedBytes: number }> {
        const json = JSON.stringify({ version: 1, state })
        const uncompressedBytes = new TextEncoder().encode(json).length

        const response = await this.request({ type: 'EXPORT', payload: state })
        if (response.type === 'ERROR') throw new Error(response.error)
        if (response.type !== 'EXPORT_SUCCESS') throw new Error('Unexpected response from save worker')

        const value = response.payload
        const compressedBytes = estimateBase64DecodedBytes(value)

        return { value, uncompressedBytes, compressedBytes }
    }

    async importSave(value: string): Promise<GameState> {
        const response = await this.request({ type: 'IMPORT', payload: value })
        if (response.type === 'ERROR') throw new Error(response.error)
        if (response.type !== 'IMPORT_SUCCESS') throw new Error('Unexpected response from save worker')
        return response.payload
    }
}

export const saveService = new SaveService()
