import { GameState } from '../game/GameState'
import { useGameStore } from '../game/state'
import { addItem, removeItem } from '../storage/storageFunctions'
import { CharacterStateAdapter } from './characterAdapter'
import { selectPlayerAvAttr } from './characterSelectors'
import { PLAYER_ID } from './charactersConst'
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
    let char = CharacterStateAdapter.selectEx(state.characters, charId)

    const equipped = char.inventory[slot]
    if (equipped)
        state = addItem(state, equipped.stdItemId ?? null, equipped.craftItemId ?? null, equipped.quantity ?? 1)

    char = CharacterStateAdapter.selectEx(state.characters, charId)
    if (!char) throw new Error(`Character with id not found ${charId}`)
    if (stdItemId || craftItemId) {
        const equippedSlot: Inventory = { quantity }
        if (stdItemId) equippedSlot.stdItemId = stdItemId
        else if (craftItemId) equippedSlot.craftItemId = craftItemId
        state = removeItem(state, stdItemId, craftItemId, quantity)
        state = {
            ...state,
            characters: CharacterStateAdapter.update(state.characters, charId, {
                inventory: { ...char.inventory, [slot]: equippedSlot },
            }),
        }
    } else {
        const { [slot]: _, ...inventory } = char.inventory
        state = {
            ...state,
            characters: CharacterStateAdapter.update(state.characters, charId, {
                inventory,
            }),
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

const addHealthPoints = (state: GameState) => {
    const av = selectPlayerAvAttr(state)
    if (av < 1) return state
    const char = CharacterStateAdapter.selectEx(state.characters, PLAYER_ID)
    const healthPoints = char.healthPoints + 1
    state = {
        ...state,
        characters: CharacterStateAdapter.update(state.characters, PLAYER_ID, { healthPoints }),
    }
    return state
}
export const addHealthPointsClick = () => useGameStore.setState((s) => addHealthPoints(s))

const addStaminaPoint = (state: GameState) => {
    const av = selectPlayerAvAttr(state)
    if (av < 1) return state
    const char = CharacterStateAdapter.selectEx(state.characters, PLAYER_ID)
    const staminaPoints = char.staminaPoints + 1
    state = {
        ...state,
        characters: CharacterStateAdapter.update(state.characters, PLAYER_ID, { staminaPoints }),
    }
    return state
}
export const addStaminaPointClick = () => useGameStore.setState((s) => addStaminaPoint(s))

const addManaPoint = (state: GameState) => {
    const av = selectPlayerAvAttr(state)
    if (av < 1) return state
    const char = CharacterStateAdapter.selectEx(state.characters, PLAYER_ID)
    const manaPoints = char.manaPoints + 1
    state = {
        ...state,
        characters: CharacterStateAdapter.update(state.characters, PLAYER_ID, { manaPoints }),
    }
    return state
}
export const addManaPointClick = () => useGameStore.setState((s) => addManaPoint(s))
