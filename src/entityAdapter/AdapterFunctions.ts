import { InitialState } from './InitialState'

export function createImmutable<T>(state: InitialState<T>, id: string, data: T): InitialState<T> {
    return { entries: { ...state.entries, [id]: data }, ids: [...state.ids, id] }
}
export function createMutable<T>(state: InitialState<T>, id: string, data: T): InitialState<T> {
    state.ids.push(id)
    state.entries[id] = data
    return state
}

export function removeImmutable<T>(state: InitialState<T>, id: string) {
    const { [id]: _, ...newEntries } = state.entries
    return { entries: newEntries, ids: state.ids.filter((e) => e !== id) }
}
export function removeMutable<T>(state: InitialState<T>, id: string) {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete state.entries[id]
    const index = state.ids.indexOf(id)
    state.ids.splice(index, 1)
    return state
}

export function updateImmutable<T>(state: InitialState<T>, id: string, data: Partial<T>) {
    const existing = state.entries[id]
    if (!existing) throw new Error(`${id} doesn't exists`)
    const complete: T = { ...existing, ...data }
    return { ids: state.ids, entries: { ...state.entries, [id]: complete } }
}
export function updateMutable<T>(state: InitialState<T>, id: string, data: Partial<T>) {
    const existing = state.entries[id]
    if (!existing) throw new Error(`${id} doesn't exists`)
    const complete: T = { ...existing, ...data }
    state.entries[id] = complete
    return state
}

export function replaceImmutable<T>(state: InitialState<T>, id: string, data: T) {
    const existing = state.entries[id]
    if (existing === undefined) throw new Error(`${id} doesn't exists`)
    return { entries: { ...state.entries, [id]: data } }
}
export function replaceMutable<T>(state: InitialState<T>, id: string, data: T) {
    const existing = state.entries[id]
    if (existing === undefined) throw new Error(`${id} doesn't exists`)
    state.entries[id] = data
    return state
}

export class AdapterFunctions {
    create = createImmutable
    remove = removeImmutable
    update = updateImmutable
    replace = replaceImmutable

    setImmutable() {
        this.create = createImmutable
        this.remove = removeImmutable
        this.update = updateImmutable
        this.replace = replaceImmutable
    }
    setMutable() {
        this.create = createMutable
        this.remove = removeMutable
        this.update = updateMutable
        this.replace = replaceMutable
    }
}
export const adapterFunctions = new AdapterFunctions()
