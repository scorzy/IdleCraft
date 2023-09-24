import equal from 'react-fast-compare'

export interface InitialState<T> {
    ids: string[]
    entries: { [k in string]: T }
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
        state = { ...state, entries: { ...state.entries, [id]: { ...state.entries[id], ...data } } }
        state = this.sortIds(state)
        return state
    }
    replace(state: InitialState<T>, id: string, data: T) {
        const existing = state.entries[id]
        if (existing === undefined) throw new Error(`${id} doesn't exists`)
        state = { ...state, entries: { ...state.entries, [id]: data } }
        state = this.sortIds(state)
        return state
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

        const { [id]: value, ...newEntries } = state.entries

        state = { entries: newEntries, ids: state.ids.filter((e) => e !== id) }

        return state
    }
    getIds(state: InitialState<T>): string[] {
        return state.ids
    }
    sortIds(state: InitialState<T>): InitialState<T> {
        if (this.sort === undefined) return state
        const ids = Object.values(state.entries)
            .sort(this.sort)
            .map((v) => this.getId(v))
        if (!equal(state.ids, ids)) state = { ...state, ids }
        return state
    }
    select(state: InitialState<T>, id: string): T | undefined {
        return state.entries[id]
    }
    selectEx(state: InitialState<T>, id: string): T {
        const ret = state.entries[id]
        if (ret === undefined) throw new Error(`Data not found ${id}`)
        return ret
    }
    find(state: InitialState<T>, fun: (entity: T) => boolean): T | undefined {
        const ids = state.ids
        for (const id of ids) {
            const data = state.entries[id]
            if (data && fun(data)) return data
        }
    }
    load(data: unknown): InitialState<T> {
        let state = this.getInitialState()
        if (
            data &&
            typeof data === 'object' &&
            'ids' in data &&
            'entries' in data &&
            data.ids &&
            data.entries &&
            Array.isArray(data.ids)
        ) {
            const entryFix = data.entries as Record<string, unknown>
            for (const id of data.ids) {
                if (typeof id !== 'string') continue
                const data2 = entryFix[id]
                const entry = this.complete(data2)
                if (entry) state = this.create(state, entry)
            }
        }
        return state
    }
    complete(data: unknown): T | null {
        return data as T
    }
}
