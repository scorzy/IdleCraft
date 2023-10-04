import { Item } from './Item'

export function loadItem(data: unknown): Item | null {
    if (!data) return null
    if (typeof data !== 'object') return null
    if (!('id' in data)) return null

    return data as Item
}
