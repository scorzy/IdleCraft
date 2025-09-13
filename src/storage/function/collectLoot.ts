import { GameState } from '../../game/GameState'
import { setState } from '../../game/state'
import { addItem } from '../storageFunctions'

export function collectLoot(state: GameState, lootId: string): void {
    const loot = state.locations[state.location].loot.find((l) => l.id === lootId)
    if (!loot) throw new Error(`[collectLoot]: Loot with id ${lootId} not found`)

    addItem(state, loot.itemId, loot.quantity)

    const lottArr = state.locations[state.location].loot
    const index = lottArr.findIndex((l) => l.id === lootId)

    if (index === -1) return

    lottArr.splice(index, 1)
}

export const collectLootUi = (lootId: string) => setState((state) => collectLoot(state, lootId))
