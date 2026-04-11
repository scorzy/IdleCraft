import { GameState } from '../GameState'
import { WorkerRequest, WorkerResponse } from './saveWorkerTypes'

interface SaveEnvelopeV1 {
    version: 1
    state: GameState
}

const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
    return Uint8Array.from(bytes).buffer as ArrayBuffer
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null
}

function isSaveEnvelopeV1(value: unknown): value is SaveEnvelopeV1 {
    if (!isRecord(value)) return false
    return value.version === 1 && 'state' in value && isRecord(value.state)
}

async function compressGzip(input: Uint8Array): Promise<Uint8Array> {
    const stream = new Blob([toArrayBuffer(input)]).stream().pipeThrough(new CompressionStream('gzip'))
    const buffer = await new Response(stream).arrayBuffer()
    return new Uint8Array(buffer)
}

async function decompressGzip(input: Uint8Array): Promise<Uint8Array> {
    const stream = new Blob([toArrayBuffer(input)]).stream().pipeThrough(new DecompressionStream('gzip'))
    const buffer = await new Response(stream).arrayBuffer()
    return new Uint8Array(buffer)
}

function bytesToBase64(bytes: Uint8Array): string {
    let binary = ''
    const chunkSize = 0x8000
    for (let i = 0; i < bytes.length; i += chunkSize) {
        const chunk = bytes.subarray(i, i + chunkSize)
        binary += String.fromCharCode(...chunk)
    }
    return btoa(binary)
}

function base64ToBytes(base64: string): Uint8Array {
    const binary = atob(base64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i)
    }
    return bytes
}

async function exportSave(state: GameState): Promise<string> {
    const envelope: SaveEnvelopeV1 = { version: 1, state }
    const json = JSON.stringify(envelope)
    const rawBytes = textEncoder.encode(json)
    const compressed = await compressGzip(rawBytes)
    return bytesToBase64(compressed)
}

async function importSave(value: string): Promise<GameState> {
    const input = value.trim()
    if (input.length === 0) throw new Error('Save string is empty')

    let compressed: Uint8Array
    try {
        compressed = base64ToBytes(input)
    } catch {
        throw new Error('Invalid base64 save string')
    }

    let jsonBytes: Uint8Array
    try {
        jsonBytes = await decompressGzip(compressed)
    } catch {
        throw new Error('Gzip decompression failed')
    }

    let parsed: unknown
    try {
        parsed = JSON.parse(textDecoder.decode(jsonBytes))
    } catch {
        throw new Error('Invalid JSON in save data')
    }

    if (!isSaveEnvelopeV1(parsed)) throw new Error('Unsupported save format or version')
    return parsed.state
}

async function handleMessage(request: WorkerRequest): Promise<WorkerResponse> {
    if (request.type === 'EXPORT') {
        const output = await exportSave(request.payload)
        return { type: 'EXPORT_SUCCESS', payload: output }
    }

    const output = await importSave(request.payload)
    return { type: 'IMPORT_SUCCESS', payload: output }
}

self.addEventListener('message', async (event: MessageEvent<WorkerRequest>) => {
    try {
        const response = await handleMessage(event.data)
        self.postMessage(response)
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown save worker error'
        const response: WorkerResponse = { type: 'ERROR', error: message }
        self.postMessage(response)
    }
})
