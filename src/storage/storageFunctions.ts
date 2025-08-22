import moize from 'moize'
import { CharacterAdapter } from '../characters/characterAdapter'
import { CRAFTED_ITEM_PREFIX } from '../const'
import { GameState } from '../game/GameState'
import { useGameStore } from '../game/state'
import { GameLocations } from '../gameLocations/GameLocations'
import { Item } from '../items/Item'
import { getUniqueId } from '../utils/getUniqueId'
import { myCompare } from '../utils/myCompare'
import { ItemAdapter } from './ItemAdapter'
import { StorageState } from './storageTypes'
import { InitialState } from '@/entityAdapter/InitialState'

export function addGold(state: GameState, amount: number): GameState {
    return { ...state, gold: Math.max(0, state.gold + amount) }
}

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

export const selectCraftItemId = moize(
    (state: InitialState<Item>, item: Item) => ItemAdapter.find(state, (i) => myCompare(i, item))?.id ?? null,
    {
        maxSize: 5,
    }
)

export function saveCraftItem(state: InitialState<Item>, item: Item): { id: string; state: InitialState<Item> } {
    const id = selectCraftItemId(state, item)
    if (id) return { id, state }

    const newItem = { ...item, id: CRAFTED_ITEM_PREFIX + getUniqueId() }
    state = ItemAdapter.create(state, newItem)

    return { id: newItem.id, state }
}

function removeCraftItem(state: InitialState<Item>, id: string): InitialState<Item> {
    const item = ItemAdapter.select(state, id)
    if (!item) return state

    return ItemAdapter.remove(state, id)
}
