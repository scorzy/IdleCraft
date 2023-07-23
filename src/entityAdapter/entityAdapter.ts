export interface InitialState<T> {
    ids: string[]
    entries: {
        [k: string]: T
    }
}

export abstract class AbstractEntityAdapter<T> {
    abstract getId(data: T): string
    sort?: (a: T, b: T) => number

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
        const ids = [...state.ids, id]
        state = { ...state, entries: { ...state.entries, [id]: data }, ids }
        state = this.sortIds(state)
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

        if (existing === undefined) {
            const ids = [...state.ids, id]
            state = { ...state, ids }
        }
        state = this.sortIds(state)
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
    sortIds(state: InitialState<T>): InitialState<T> {
        if (this.sort === undefined) return state
        state = {
            ...state,
            ids: Object.values(state.entries)
                .sort(this.sort)
                .map((v) => this.getId(v)),
        }
        return state
    }
    select(state: InitialState<T>, id: string): T | undefined {
        return state.entries[id]
    }
}
