const TOON_PREFIX = 'TOON1:'

interface ToonNodeObject {
    [key: string]: ToonNode
}

type ToonNode = string | number | boolean | null | ToonNode[] | ToonNodeObject

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null
}

function toNode(value: unknown): ToonNode {
    if (value === null) return null
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return value
    if (Array.isArray(value)) return value.map((item) => toNode(item))
    if (!isRecord(value)) throw new Error('Unsupported value in TOON encoder')

    const out: ToonNodeObject = {}
    const keys = Object.keys(value).sort((a, b) => a.localeCompare(b))
    for (const key of keys) {
        out[key] = toNode(value[key])
    }
    return out
}

export function jsonToToon(json: string): string {
    let parsed: unknown
    try {
        parsed = JSON.parse(json)
    } catch {
        throw new Error('Invalid JSON before TOON conversion')
    }

    const node = toNode(parsed)
    return `${TOON_PREFIX}${JSON.stringify(node)}`
}

export function toonToJson(toon: string): string {
    if (!toon.startsWith(TOON_PREFIX)) throw new Error('Invalid TOON payload')
    const raw = toon.slice(TOON_PREFIX.length)

    let parsed: unknown
    try {
        parsed = JSON.parse(raw)
    } catch {
        throw new Error('Invalid TOON body')
    }

    return JSON.stringify(parsed)
}
