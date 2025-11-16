import { adapterFunctions } from './AdapterFunctions'
import { InitialState } from './InitialState'

export abstract class AbstractEntityAdapter<T> {
    abstract getId(data: T): string

    getInitialState(): InitialState<T> {
        return {
            ids: [],
            entries: {},
        }
    }
    create(state: InitialState<T>, data: T) {
        adapterFunctions.create(state, this.getId(data), data)
    }
    update(state: InitialState<T>, id: string, data: Partial<T>) {
        adapterFunctions.update(state, id, data)
    }
    replace(state: InitialState<T>, id: string, data: T) {
        adapterFunctions.replace(state, id, data)
    }
    upsertMerge(state: InitialState<T>, data: T) {
        const id = this.getId(data)
        const existing = state.entries[id]

        if (!existing) this.create(state, data)
        else this.update(state, id, data)
    }
    remove(state: InitialState<T>, id: string) {
        const existing = state.entries[id]
        if (!existing) throw new Error(`${id} doesn't exists`)

        adapterFunctions.remove(state, id)
    }
    getIds(state: InitialState<T>): string[] {
        return state.ids.slice()
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
    findMany(state: InitialState<T>, fun: (entity: T) => boolean): T[] | undefined {
        const ret: T[] = []
        const ids = state.ids
        for (const id of ids) {
            const data = state.entries[id]
            if (data && fun(data)) ret.push(data)
        }
        return ret
    }
    findManyIds(state: InitialState<T>, fun: (entity: T) => boolean): string[] {
        return this.findMany(state, fun)?.map((el) => this.getId(el)) ?? []
    }
    count(state: InitialState<T>, fun: (entity: T) => boolean): number {
        let ret = 0
        this.forEach(state, (e) => {
            if (fun(e)) ret++
        })
        return ret
    }
    load(data: unknown): InitialState<T> {
        const state = this.getInitialState()
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
                if (entry) this.create(state, entry)
            }
        }
        return state
    }
    complete(data: unknown): T | null {
        return data as T
    }
    findIds(data: InitialState<T>): string[] {
        return data.ids
    }
    forEach(state: InitialState<T>, fun: (el: T) => void) {
        const ids = state.ids
        for (const id of ids) {
            const element = state.entries[id]
            if (element) fun(element)
        }
    }
    every(state: InitialState<T>, fun: (el: T) => boolean): boolean {
        const ids = state.ids
        for (const id of ids) {
            const element = state.entries[id]
            if (element && !fun(element)) return false
        }
        return true
    }
}
