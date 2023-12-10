import { GameState } from '../game/GameState'
import { useGameStore } from '../game/state'
import { addItem, removeItem } from '../storage/storageFunctions'
import { selectCharacter, selectPlayerAvAttr } from './characterSelectors'
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
                    ...char,
                    inventory: { ...char.inventory, [slot]: equippedSlot },
                },
            },
        }
    } else {
        const { [slot]: _, ...inventory } = char.inventory
        state = {
            ...state,
            characters: {
                ...state.characters,
                [charId]: {
                    ...char,
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

export const addHealthPoints = (state: GameState) => {
    const av = selectPlayerAvAttr(state)
    if (av < 1) return state
    const char = selectCharacter(state, PLAYER_ID)
    const healthPoints = char.healthPoints + 1
    state = {
        ...state,
        characters: {
            ...state.characters,
            [PLAYER_ID]: {
                ...char,
                healthPoints,
            },
        },
    }
    return state
}
export const addHealthPointsClick = () => useGameStore.setState((s) => addHealthPoints(s))

export const addStaminaPoint = (state: GameState) => {
    const av = selectPlayerAvAttr(state)
    if (av < 1) return state
    const char = selectCharacter(state, PLAYER_ID)
    const staminaPoint = char.staminaPoints + 1
    state = {
        ...state,
        characters: {
            ...state.characters,
            [PLAYER_ID]: {
                ...char,
                staminaPoints: staminaPoint,
            },
        },
    }
    return state
}
export const addStaminaPointClick = () => useGameStore.setState((s) => addStaminaPoint(s))

export const addManaPoint = (state: GameState) => {
    const av = selectPlayerAvAttr(state)
    if (av < 1) return state
    const char = selectCharacter(state, PLAYER_ID)
    const manaPoints = char.manaPoints + 1
    state = {
        ...state,
        characters: {
            ...state.characters,
            [PLAYER_ID]: {
                ...char,
                manaPoints,
            },
        },
    }
    return state
}
export const addManaPointClick = () => useGameStore.setState((s) => addManaPoint(s))
