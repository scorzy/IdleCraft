// @ts-nocheck
import { jsonToToon, toonToJson } from './toonParser'

const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()

function toArrayBuffer(bytes) {
    return Uint8Array.from(bytes).buffer
}

function isRecord(value) {
    return typeof value === 'object' && value !== null
}

function isSaveEnvelopeV1(value) {
    if (!isRecord(value)) return false
    return value.version === 1 && 'state' in value && isRecord(value.state)
}

async function compressGzip(input) {
    const stream = new Blob([toArrayBuffer(input)]).stream().pipeThrough(new CompressionStream('gzip'))
    const buffer = await new Response(stream).arrayBuffer()
    return new Uint8Array(buffer)
}

async function decompressGzip(input) {
    const stream = new Blob([toArrayBuffer(input)]).stream().pipeThrough(new DecompressionStream('gzip'))
    const buffer = await new Response(stream).arrayBuffer()
    return new Uint8Array(buffer)
}

function bytesToBase64(bytes) {
    let binary = ''
    const chunkSize = 0x8000
    for (let i = 0; i < bytes.length; i += chunkSize) {
        const chunk = bytes.subarray(i, i + chunkSize)
        binary += String.fromCharCode(...chunk)
    }
    return btoa(binary)
}

function base64ToBytes(base64) {
    const binary = atob(base64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i)
    }
    return bytes
}

async function exportSave(state) {
    const envelope = { version: 1, state }
    const json = JSON.stringify(envelope)
    const toon = jsonToToon(json)
    const rawBytes = textEncoder.encode(toon)
    const compressed = await compressGzip(rawBytes)
    return bytesToBase64(compressed)
}

async function importSave(value) {
    const input = value.trim()
    if (input.length === 0) throw new Error('Save string is empty')

    let compressed
    try {
        compressed = base64ToBytes(input)
    } catch {
        throw new Error('Invalid base64 save string')
    }

    let toonBytes
    try {
        toonBytes = await decompressGzip(compressed)
    } catch {
        throw new Error('Gzip decompression failed')
    }

    let json
    try {
        const toon = textDecoder.decode(toonBytes)
        json = toonToJson(toon)
    } catch {
        throw new Error('Invalid TOON payload')
    }

    let parsed
    try {
        parsed = JSON.parse(json)
    } catch {
        throw new Error('Invalid JSON in save data')
    }

    if (!isSaveEnvelopeV1(parsed)) throw new Error('Unsupported save format or version')
    return parsed.state
}

async function handleMessage(request) {
    if (request.type === 'EXPORT') {
        const output = await exportSave(request.payload)
        return { type: 'EXPORT_SUCCESS', payload: output }
    }

    const output = await importSave(request.payload)
    return { type: 'IMPORT_SUCCESS', payload: output }
}

self.addEventListener('message', async (event) => {
    try {
        const response = await handleMessage(event.data)
        self.postMessage(response)
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown save worker error'
        self.postMessage({ type: 'ERROR', error: message })
    }
})
