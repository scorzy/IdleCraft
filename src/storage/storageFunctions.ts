import { GameState } from '../game/GameState'
import { GameLocations } from '../gameLocations/GameLocations'
import { StorageState } from './storageState'

function subAddItem(
    state: StorageState,
    stdItemId: string | null,
    craftItemId: string | null,
    qta: number
): StorageState {
    let subState: { [k: string]: number } = state.StdItems
    let id = ''

    if (craftItemId !== null) {
        subState = state.CraftedItems
        id = craftItemId
    } else if (stdItemId !== null) id = stdItemId
    else throw new Error('[addItem] stdItemId and craftItemId null')

    const old = subState[id]
    const newQta = Math.max(qta + (old || 0), 0)

    if (Math.abs(newQta) < Number.EPSILON) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [id]: value, ...newSubState } = subState
        subState = newSubState
    } else subState = { ...subState, [id]: newQta }

    if (stdItemId !== null) state = { ...state, StdItems: subState }
    else state = { ...state, CraftedItems: subState }

    return state
}
function subHasItem(state: StorageState, stdItemId: string | null, craftItemId: string | null, qta: number): boolean {
    if (stdItemId !== null) return (state.StdItems[stdItemId] ?? 0) >= qta
    else if (craftItemId !== null) return (state.CraftedItems[craftItemId] ?? 0) >= qta
    else throw new Error('[hasItem] stdItemId and craftItemId null')
}

export function addItem(
    state: GameState,
    stdItemId: string | null,
    craftItemId: string | null,
    qta: number,
    location?: GameLocations
): GameState {
    location = location || state.location
    let storage = state.locations[location].storage
    storage = subAddItem(storage, stdItemId, craftItemId, qta)
    state = { ...state, locations: { ...state.locations, [location]: { ...state.locations[location], storage } } }
    return state
}
export function removeItem(
    state: GameState,
    stdItemId: string | null,
    craftItemId: string | null,
    qta: number,
    location?: GameLocations
): GameState {
    return addItem(state, stdItemId, craftItemId, qta * -1, location)
}
export function hasItem(
    state: GameState,
    stdItemId: string | null,
    craftItemId: string | null,
    qta: number,
    location?: GameLocations
): boolean {
    location = location || state.location
    const storage = state.locations[location].storage
    return subHasItem(storage, stdItemId, craftItemId, qta)
}
