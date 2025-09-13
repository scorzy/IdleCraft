import { InitialState } from './InitialState'

export function createMutable<T>(state: InitialState<T>, id: string, data: T): InitialState<T> {
    state.ids.push(id)
    state.entries[id] = data
    return state
}

export function removeMutable<T>(state: InitialState<T>, id: string) {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete state.entries[id]
    const index = state.ids.indexOf(id)
    state.ids.splice(index, 1)
    return state
}

export function updateMutable<T>(state: InitialState<T>, id: string, data: Partial<T>) {
    const existing = state.entries[id]
    if (!existing) throw new Error(`${id} doesn't exists`)
    const complete: T = { ...existing, ...data }
    state.entries[id] = complete
    return state
}

export function replaceMutable<T>(state: InitialState<T>, id: string, data: T) {
    const existing = state.entries[id]
    if (existing === undefined) throw new Error(`${id} doesn't exists`)
    state.entries[id] = data
    return state
}
export class AdapterFunctions {
    create = createMutable
    remove = removeMutable
    update = updateMutable
    replace = replaceMutable
}

export const adapterFunctions = new AdapterFunctions()
