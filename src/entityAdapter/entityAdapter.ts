export interface CreateEntityAdapterParams<T> {
    getId: (data: T) => string
}
export function createEntityAdapter<T>({ getId }: CreateEntityAdapterParams<T>) {
    const create = (state: { [k: string]: T }, data: T) => {
        const id = getId(data)
        const existing = state[id]
        if (existing !== undefined) throw new Error(`${id} already exists`)
        state = { ...state, [id]: data }
        return state
    }
    const update = (state: { [k: string]: T }, id: string, data: Partial<T>) => {
        const existing = state[id]
        if (existing === undefined) throw new Error(`${id} doesn't exists`)
        state = { ...state, [id]: { ...existing, ...data } }
        return state
    }
    const upsertMerge = (state: { [k: string]: T }, data: T) => {
        const id = getId(data)
        const existing = state[id]
        state = { ...state, [id]: { ...existing, ...data } }
        return state
    }
    const remove = (state: { [k: string]: T }, id: string) => {
        if (id === undefined) throw new Error('id undefined')
        const existing = state[id]
        if (existing === undefined) throw new Error(`${id} doesn't exists`)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [id]: value, ...newState } = state
        return newState
    }

    return { create, update, upsertMerge, remove }
}
