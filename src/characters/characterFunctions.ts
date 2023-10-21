import { GameState } from '../game/GameState'
import { useGameStore } from '../game/state'
import { addItem, removeItem } from '../storage/storageFunctions'
import { EquipSlotsEnum } from './equipSlotsEnum'
import { Inventory } from './inventory'

export function equipItem(
    state: GameState,
    charId: string,
    slot: EquipSlotsEnum,
    stdItemId: string | null,
    craftItemId: string | null,
    quantity = 1
): GameState {
    let char = state.characters[charId]
    if (!char) throw new Error(`Character with id not found ${charId}`)
    const equipped = char.inventory[slot]
    if (equipped)
        state = addItem(state, equipped.stdItemId ?? null, equipped.craftItemId ?? null, equipped.quantity ?? 1)

    char = state.characters[charId]
    if (!char) throw new Error(`Character with id not found ${charId}`)
    if (stdItemId || craftItemId) {
        const equippedSlot: Inventory = { quantity }
        if (stdItemId) equippedSlot.stdItemId = stdItemId
        else if (craftItemId) equippedSlot.craftItemId = craftItemId
        state = removeItem(state, stdItemId, craftItemId, quantity)
        state = {
            ...state,
            characters: {
                ...state.characters,
                [charId]: {
                    ...state.characters[charId],
                    inventory: { ...char.inventory, [slot]: equippedSlot },
                },
            },
        }
    } else {
        const { [slot]: removed, ...inventory } = char.inventory
        state = {
            ...state,
            characters: {
                ...state.characters,
                [charId]: {
                    ...state.characters[charId],
                    inventory,
                },
            },
        }
    }

    return state
}
export const equipClick = (
    charId: string,
    slot: EquipSlotsEnum,
    stdItemId: string | null,
    craftItemId: string | null,
    quantity = 1
) => useGameStore.setState((s) => equipItem(s, charId, slot, stdItemId, craftItemId, quantity))
