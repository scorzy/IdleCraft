import { CharacterAdapter } from '../characters/characterAdapter'
import { CRAFTED_ITEM_PREFIX } from '../const'
import { GameState } from '../game/GameState'
import { setState } from '../game/setState'
import { GameLocations } from '../gameLocations/GameLocations'
import { Item } from '../items/Item'
import { getUniqueId } from '../utils/getUniqueId'
import { myCompare } from '../utils/myCompare'
import { ItemAdapter } from './ItemAdapter'
import { onItemRemovedListeners } from './storageEvents'
import { StorageAdapter } from './storageAdapter'
import { InitialState } from '@/entityAdapter/InitialState'

export function addGold(state: GameState, amount: number): void {
    state.gold = Math.max(0, state.gold + amount)
}

export function addItem(state: GameState, itemId: string, qta: number, location?: GameLocations): void {
    if (Math.abs(qta) < 0.00001) return

    location = location ?? state.location
    const storage = state.locations[location].storage

    const old = StorageAdapter.select(storage, itemId)
    const newQta = Math.max(qta + (old?.quantity ?? 0), 0)

    if (Math.abs(newQta) < Number.EPSILON) {
        if (!old) return
        for (const event of onItemRemovedListeners) event(state, itemId, location, old?.quantity ?? Math.abs(qta))

        StorageAdapter.remove(storage, itemId)
    } else if (old) {
        if (qta < 0) for (const event of onItemRemovedListeners) event(state, itemId, location, Math.abs(qta))
        old.quantity = newQta
    } else StorageAdapter.upsertMerge(storage, { itemId, quantity: newQta })

    if (isCrafted(itemId) && !isCraftItemUsed(state, itemId)) removeCraftItem(state.craftedItems, itemId)
}

export function isCrafted(itemId: string): boolean {
    return itemId.startsWith(CRAFTED_ITEM_PREFIX)
}

export function removeItem(state: GameState, itemId: string, qta: number, location?: GameLocations): void {
    addItem(state, itemId, qta * -1, location)
}

function isCraftItemUsed(state: GameState, craftItemId: string): boolean {
    const equipped = CharacterAdapter.find(
        state.characters,
        (char) => !!Object.values(char.inventory).find((inv) => inv.itemId === craftItemId)
    )

    if (equipped) return true

    const locations = Object.values(state.locations)
    for (const loc of locations) if (StorageAdapter.select(loc.storage, craftItemId)?.quantity ?? 0 > 0) return true

    return false
}

export function hasItem(state: GameState, stdItemId: string, qta: number, location?: GameLocations): boolean {
    location = location ?? state.location
    const storage = state.locations[location].storage
    return (StorageAdapter.select(storage, stdItemId)?.quantity ?? 0) >= qta
}

export const setSelectedItem = (itemId: string | null, location: GameLocations) =>
    setState((s) => {
        s.ui.selectedItemId = itemId ?? null
        s.ui.selectedItemLocation = location
    })

export const selectCraftItemId = (state: InitialState<Item>, item: Item) =>
    ItemAdapter.find(state, (i) => myCompare(i, item))?.id ?? null

export function saveCraftItem(state: InitialState<Item>, item: Item): { id: string } {
    const id = selectCraftItemId(state, item)
    if (id) return { id }

    const newItem = { ...item, id: CRAFTED_ITEM_PREFIX + getUniqueId() }
    ItemAdapter.create(state, newItem)

    return { id: newItem.id }
}

function removeCraftItem(state: InitialState<Item>, id: string): void {
    const item = ItemAdapter.select(state, id)
    if (!item) return

    ItemAdapter.remove(state, id)
}
