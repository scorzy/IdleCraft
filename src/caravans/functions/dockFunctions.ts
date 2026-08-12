import { GameState } from '../../game/GameState'
import { GameLocationAdapter } from '../../gameLocations/GameLocationAdapter'
import { GameLocations } from '../../gameLocations/GameLocations'
import { StorageAdapter } from '../../storage/storageAdapter'
import { addItem } from '../../storage/storageFunctions'

export function addToDock(state: GameState, location: GameLocations, itemId: string, qty: number): void {
    if (qty <= 0) return

    const dock = GameLocationAdapter.selectEx(state.locations, location).dock
    const existing = StorageAdapter.select(dock, itemId)
    if (existing) existing.quantity += qty
    else StorageAdapter.create(dock, { itemId, quantity: qty })
}

export function unloadDockItem(state: GameState, location: GameLocations, itemId: string): void {
    const dock = GameLocationAdapter.selectEx(state.locations, location).dock
    const entry = StorageAdapter.select(dock, itemId)
    if (!entry) return

    const qty = entry.quantity
    StorageAdapter.remove(dock, itemId)
    addItem(state, itemId, qty, location)
}

export function unloadAllDock(state: GameState, location: GameLocations): void {
    const dock = GameLocationAdapter.selectEx(state.locations, location).dock
    StorageAdapter.forEach(dock, (entry) => unloadDockItem(state, location, entry.itemId))
}
