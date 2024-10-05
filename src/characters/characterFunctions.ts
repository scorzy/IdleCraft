import { GameState } from '../game/GameState'
import { useGameStore } from '../game/state'
import { addItem, removeItem } from '../storage/storageFunctions'
import { CharacterAdapter } from './characterAdapter'
import { getCharacterSelector } from './characterSelectorsNew'
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
    let char = CharacterAdapter.selectEx(state.characters, charId)

    const equipped = char.inventory[slot]
    if (equipped)
        state = addItem(state, equipped.stdItemId ?? null, equipped.craftItemId ?? null, equipped.quantity ?? 1)

    char = CharacterAdapter.selectEx(state.characters, charId)

    if (stdItemId || craftItemId) {
        const equippedSlot: Inventory = { quantity }
        if (stdItemId) equippedSlot.stdItemId = stdItemId
        else if (craftItemId) equippedSlot.craftItemId = craftItemId
        state = {
            ...state,
            characters: CharacterAdapter.update(state.characters, charId, {
                inventory: { ...char.inventory, [slot]: equippedSlot },
            }),
        }
        state = removeItem(state, stdItemId, craftItemId, quantity)
    } else {
        const { [slot]: _, ...inventory } = char.inventory
        state = {
            ...state,
            characters: CharacterAdapter.update(state.characters, charId, {
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

const addHealthPoints = (state: GameState, charId: string) => {
    const av = getCharacterSelector(charId).AvailableAttributes(state)
    if (av < 1) return state

    const charSel = getCharacterSelector(charId)

    const maxPrev = charSel.MaxHealth(state)
    const char = CharacterAdapter.selectEx(state.characters, charId)
    const healthPoints = char.healthPoints + 1
    state = {
        ...state,
        characters: CharacterAdapter.update(state.characters, charId, { healthPoints }),
    }
    const maxNow = charSel.MaxHealth(state)
    const diff = Math.max(maxNow - maxPrev, 0)
    if (diff > 0) {
        const health = Math.min(maxNow, char.health + diff)
        state = {
            ...state,
            characters: CharacterAdapter.update(state.characters, charId, { health }),
        }
    }
    return state
}
export const addHealthPointClick = (charId: string) => useGameStore.setState((s) => addHealthPoints(s, charId))

const addStaminaPoint = (state: GameState, charId: string) => {
    const av = getCharacterSelector(charId).AvailableAttributes(state)
    if (av < 1) return state
    const charSel = getCharacterSelector(charId)
    const maxPrev = charSel.MaxStamina(state)
    const char = CharacterAdapter.selectEx(state.characters, PLAYER_ID)
    const staminaPoints = char.staminaPoints + 1
    state = {
        ...state,
        characters: CharacterAdapter.update(state.characters, PLAYER_ID, { staminaPoints }),
    }
    const maxNow = charSel.MaxStamina(state)
    const diff = Math.max(maxNow - maxPrev, 0)
    if (diff > 0) {
        const stamina = Math.min(maxNow, char.health + diff)
        state = {
            ...state,
            characters: CharacterAdapter.update(state.characters, charId, { stamina }),
        }
    }
    return state
}
export const addStaminaPointClick = (charId: string) => useGameStore.setState((s) => addStaminaPoint(s, charId))

const addManaPoint = (state: GameState, charId: string) => {
    const av = getCharacterSelector(charId).AvailableAttributes(state)
    if (av < 1) return state
    const charSel = getCharacterSelector(charId)
    const maxPrev = charSel.MaxMana(state)
    const char = CharacterAdapter.selectEx(state.characters, PLAYER_ID)
    const manaPoints = char.manaPoints + 1
    state = {
        ...state,
        characters: CharacterAdapter.update(state.characters, PLAYER_ID, { manaPoints }),
    }
    const maxNow = charSel.MaxMana(state)
    const diff = Math.max(maxNow - maxPrev, 0)
    if (diff > 0) {
        const mana = Math.min(maxNow, char.health + diff)
        state = {
            ...state,
            characters: CharacterAdapter.update(state.characters, charId, { mana }),
        }
    }
    return state
}
export const addManaPointClick = (charId: string) => useGameStore.setState((s) => addManaPoint(s, charId))
