import { InitialState } from './InitialState'

export function createImmutable<T>(state: InitialState<T>, id: string, data: T): InitialState<T> {
    return { entries: { ...state.entries, [id]: data }, ids: [...state.ids, id] }
}

export function removeImmutable<T>(state: InitialState<T>, id: string) {
    const { [id]: _, ...newEntries } = state.entries
    return { entries: newEntries, ids: state.ids.filter((e) => e !== id) }
}

export function updateImmutable<T>(state: InitialState<T>, id: string, data: Partial<T>) {
    const existing = state.entries[id]
    if (!existing) throw new Error(`${id} doesn't exists`)
    return { ids: state.ids, entries: { ...state.entries, [id]: { ...existing, ...data } } }
}

export function replaceImmutable<T>(state: InitialState<T>, id: string, data: T) {
    const existing = state.entries[id]
    if (!existing) throw new Error(`${id} doesn't exists`)
    return { entries: { ...state.entries, [id]: data } }
}

export class AdapterFunctions {
    create = createImmutable
    remove = removeImmutable
    update = updateImmutable
    replace = replaceImmutable
}
export const adapterFunctions = new AdapterFunctions()
