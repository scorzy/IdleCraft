import { Item } from './Item'

export function loadItem(data: unknown): Item | null {
    if (!data) return null
    if (typeof data !== 'object') return null
    if (!('id' in data)) return null

    // const pars = ItemSchema.safeParse(data)
    // if (pars.success) return pars.data as Item

    return data as Item
}
