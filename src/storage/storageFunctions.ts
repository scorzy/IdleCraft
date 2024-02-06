import { CharacterAdapter } from '../characters/characterAdapter'
import { InitialState } from '../entityAdapter/entityAdapter'
import { GameState } from '../game/GameState'
import { useGameStore } from '../game/state'
import { GameLocations } from '../gameLocations/GameLocations'
import { Item } from '../items/Item'
import { getUniqueId } from '../utils/getUniqueId'
import { memoize } from '../utils/memoize'
import { memoizeOne } from '../utils/memoizeOne'
import { myCompare } from '../utils/myCompare'
import { ItemAdapter } from './ItemAdapter'
import { ItemId, StorageState } from './storageState'

export const getItemId2 = (stdItemId: string | null | undefined, craftItemId: string | null | undefined) =>
    stdItemId ? `s${stdItemId}` : craftItemId ? `c${craftItemId}` : ''

export function getItemId(s: string): ItemId | undefined {
    if (!s || s === '') return
    if (s.startsWith('s')) return { stdItemId: s.substring(1), craftItemId: null }
    else return { craftItemId: s.substring(1), stdItemId: null }
}

function subAddItem(
    state: StorageState,
    stdItemId: string | null,
    craftItemId: string | null,
    qta: number
): StorageState {
    let subState: Record<string, number> = state.StdItems
    let id = ''

    if (craftItemId) {
        subState = state.CraftedItems
        id = craftItemId
    } else if (stdItemId) id = stdItemId
    else throw new Error('[addItem] stdItemId and craftItemId null')

    const old = subState[id]
    const newQta = Math.max(qta + (old ?? 0), 0)

    if (Math.abs(newQta) < Number.EPSILON) {
        const { [id]: _, ...newSubState } = subState
        subState = newSubState
    } else subState = { ...subState, [id]: newQta }

    if (stdItemId) state = { ...state, StdItems: subState }
    else state = { ...state, CraftedItems: subState }

    return state
}

function subHasItem(state: StorageState, stdItemId: string | null, craftItemId: string | null, qta: number): boolean {
    if (stdItemId) return (state.StdItems[stdItemId] ?? 0) >= qta
    else if (craftItemId) return (state.CraftedItems[craftItemId] ?? 0) >= qta
    else throw new Error('[hasItem] stdItemId and craftItemId null')
}

export function addItem(
    state: GameState,
    stdItemId: string | null,
    craftItemId: string | null,
    qta: number,
    location?: GameLocations
): GameState {
    location = location ?? state.location
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
    state = addItem(state, stdItemId, craftItemId, qta * -1, location)

    if (craftItemId && !isCraftItemUsed(state, craftItemId))
        state = { ...state, craftedItems: removeCraftItem(state.craftedItems, craftItemId) }

    return state
}

function isCraftItemUsed(state: GameState, craftItemId: string): boolean {
    const equipped = CharacterAdapter.find(
        state.characters,
        (char) => !!Object.values(char.inventory).find((inv) => inv.craftItemId === craftItemId)
    )

    if (equipped) return true

    const locations = Object.values(state.locations)
    for (const loc of locations) if (loc.storage.CraftedItems[craftItemId] ?? 0 > 0) return true

    return false
}

export function hasItem(
    state: GameState,
    stdItemId: string | null,
    craftItemId: string | null,
    qta: number,
    location?: GameLocations
): boolean {
    location = location ?? state.location
    const storage = state.locations[location].storage
    return subHasItem(storage, stdItemId, craftItemId, qta)
}

export const setSelectedItem = (stdItemId: string | null, craftItemId: string | null, location: GameLocations) =>
    useGameStore.setState((s) => ({
        ui: {
            ...s.ui,
            selectedStdItemId: stdItemId ?? null,
            selectedCraftedItemId: craftItemId ?? null,
            selectedItemLocation: location,
        },
    }))

const craftIdsByType = new Map<string, string[]>()

const selectCraftItemMemo = memoizeOne((state: InitialState<Item>) => {
    return memoize((item: Item) => {
        const byType = craftIdsByType.get(item.type)
        if (byType) {
            for (const id of byType) {
                const itemByType = ItemAdapter.select(state, id)
                if (itemByType && myCompare(item, itemByType)) {
                    return itemByType.id
                }
            }
        }

        const res = ItemAdapter.find(state, (i) => myCompare(i, item))
        if (res) return res.id

        return null
    })
})

export function selectCraftItem(state: InitialState<Item>, item: Item): string | null {
    return selectCraftItemMemo(state)(item)
}

export function saveCraftItem(state: InitialState<Item>, item: Item): { id: string; state: InitialState<Item> } {
    const id = selectCraftItem(state, item)
    if (id !== null) return { id, state }

    const newItem = { ...item, id: getUniqueId() }
    state = ItemAdapter.create(state, newItem)

    const byType = craftIdsByType.get(item.type) ?? []
    craftIdsByType.set(newItem.type, [...byType, newItem.id])

    return { id: newItem.id, state }
}

function removeCraftItem(state: InitialState<Item>, id: string): InitialState<Item> {
    const item = ItemAdapter.select(state, id)
    if (!item) return state

    const ret = ItemAdapter.remove(state, id)
    const arr = craftIdsByType.get(item.type)
    if (!arr) return ret

    const newArr = arr.filter((a) => a !== id)
    if (newArr.length < 1) craftIdsByType.delete(item.type)
    else craftIdsByType.set(item.type, newArr)

    return ret
}
