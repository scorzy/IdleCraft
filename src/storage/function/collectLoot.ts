import { GameState } from '../../game/GameState'
import { useGameStore } from '../../game/state'
import { addItem } from '../storageFunctions'

export function collectLoot(state: GameState, lootId: string): GameState {
    const loot = state.locations[state.location].loot.find((l) => l.id === lootId)
    if (!loot) throw new Error(`Loot with id ${lootId} not found`)

    state = addItem(state, loot.itemId, loot.quantity)

    const lootArr = state.locations[state.location].loot.filter((l) => l.id !== lootId)

    state = {
        ...state,
        locations: {
            ...state.locations,
            [state.location]: {
                ...state.locations[state.location],
                loot: lootArr,
            },
        },
    }

    return state
}

export const collectLootUi = (lootId: string) => useGameStore.setState((state) => collectLoot(state, lootId))
