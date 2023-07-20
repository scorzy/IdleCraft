export interface InitialState<T> {
    ids: string[]
    entries: {
        [k: string]: T
    }
}

export abstract class AbstractEntityAdapter<T> {
    abstract getId(data: T): string
    getInitialState(): InitialState<T> {
        return {
            ids: [],
            entries: {},
        }
    }
    create(state: InitialState<T>, data: T) {
        const id = this.getId(data)
        const existing = state.entries[id]
        if (existing !== undefined) throw new Error(`${id} already exists`)
        state = { ...state, entries: { ...state.entries, [id]: data }, ids: [...state.ids, id] }

        return state
    }
    update(state: InitialState<T>, id: string, data: Partial<T>) {
        const existing = state.entries[id]
        if (existing === undefined) throw new Error(`${id} doesn't exists`)
        return { ...state, entries: { ...state.entries, [id]: data } }
    }
    upsertMerge(state: InitialState<T>, data: T) {
        const id = this.getId(data)
        const existing = state.entries[id]
        state = { ...state, entries: { ...state.entries, [id]: data } }

        if (existing === undefined) state = { ...state, ids: [...state.ids, id] }

        return state
    }
    remove(state: InitialState<T>, id: string) {
        if (id === undefined) throw new Error('id undefined')
        const existing = state.entries[id]
        if (existing === undefined) throw new Error(`${id} doesn't exists`)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [id]: value, ...newEntries } = state.entries

        state = { entries: newEntries, ids: state.ids.filter((e) => e !== id) }

        return state
    }
    getIds(state: InitialState<T>): string[] {
        return state.ids
    }
}
