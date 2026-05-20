import { GameState } from '../../game/GameState'
import { setState } from '../../game/setState'
import { GameLocationAdapter } from '../../gameLocations/GameLocationAdapter'
import { addItem } from '../storageFunctions'

export function collectLoot(state: GameState, lootId: string): void {
    const locLoot = GameLocationAdapter.selectEx(state.locations, state.location).loot
    const loot = locLoot.find((l) => l.id === lootId)
    if (!loot) throw new Error(`[collectLoot]: Loot with id ${lootId} not found`)

    addItem(state, loot.itemId, loot.quantity)

    const index = locLoot.findIndex((l) => l.id === lootId)

    if (index === -1) return

    locLoot.splice(index, 1)
}

export const collectLootUi = (lootId: string) => setState((state) => collectLoot(state, lootId))
