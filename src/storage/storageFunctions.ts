import { CharacterAdapter } from '../characters/characterAdapter'
import { CRAFTED_ITEM_PREFIX } from '../const'
import { GameState } from '../game/GameState'
import { useGameStore } from '../game/state'
import { GameLocations } from '../gameLocations/GameLocations'
import { Item } from '../items/Item'
import { getUniqueId } from '../utils/getUniqueId'
import { myCompare } from '../utils/myCompare'
import { ItemAdapter } from './ItemAdapter'
import { StorageState } from './storageState'
import { InitialState } from '@/entityAdapter/InitialState'

function subAddItem(state: StorageState, id: string, qta: number): StorageState {
    const old = state[id]
    const newQta = Math.max(qta + (old ?? 0), 0)

    if (Math.abs(newQta) < Number.EPSILON) {
        const { [id]: _, ...newSubState } = state
        state = newSubState
    } else state = { ...state, [id]: newQta }

    return state
}

function subHasItem(state: StorageState, id: string, qta: number): boolean {
    return (state[id] ?? 0) >= qta
}

export function addItem(state: GameState, itemId: string, qta: number, location?: GameLocations): GameState {
    location = location ?? state.location
    let storage = state.locations[location].storage
    storage = subAddItem(storage, itemId, qta)
    state = { ...state, locations: { ...state.locations, [location]: { ...state.locations[location], storage } } }
    return state
}

export function isCrafted(itemId: string): boolean {
    return itemId.startsWith(CRAFTED_ITEM_PREFIX)
}

export function removeItem(state: GameState, id: string, qta: number, location?: GameLocations): GameState {
    state = addItem(state, id, qta * -1, location)

    if (isCrafted(id) && !isCraftItemUsed(state, id))
        state = { ...state, craftedItems: removeCraftItem(state.craftedItems, id) }

    return state
}

function isCraftItemUsed(state: GameState, craftItemId: string): boolean {
    const equipped = CharacterAdapter.find(
        state.characters,
        (char) => !!Object.values(char.inventory).find((inv) => inv.itemId === craftItemId)
    )

    if (equipped) return true

    const locations = Object.values(state.locations)
    for (const loc of locations) if (loc.storage[craftItemId] ?? 0 > 0) return true

    return false
}

export function hasItem(state: GameState, stdItemId: string, qta: number, location?: GameLocations): boolean {
    location = location ?? state.location
    const storage = state.locations[location].storage
    return subHasItem(storage, stdItemId, qta)
}

export const setSelectedItem = (itemId: string | null, location: GameLocations) =>
    useGameStore.setState((s) => ({
        ui: {
            ...s.ui,
            selectedItemId: itemId ?? null,
            selectedItemLocation: location,
        },
    }))

const craftIdsByType = new Map<string, string[]>()

export function selectCraftItemId(state: InitialState<Item>, item: Item): string | null {
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
}

export function saveCraftItem(state: InitialState<Item>, item: Item): { id: string; state: InitialState<Item> } {
    const id = selectCraftItemId(state, item)
    if (id) return { id, state }

    const newItem = { ...item, id: CRAFTED_ITEM_PREFIX + getUniqueId() }
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
