import { GameState } from '../game/GameState'
import { addItem, removeItem } from '../storage/storageFunctions'
import { setState } from '../game/setState'
import { CharacterAdapter } from './characterAdapter'
import { getCharacterSelector } from './getCharacterSelector'
import { PLAYER_ID } from './charactersConst'
import { EquipSlotsEnum } from './equipSlotsEnum'

export function equipItem(
    state: GameState,
    charId: string,
    slot: EquipSlotsEnum,
    itemId: string | null = null,
    quantity = 1
): void {
    let char = CharacterAdapter.selectEx(state.characters, charId)

    const equipped = char.inventory[slot]
    if (equipped && itemId) addItem(state, itemId, equipped.quantity ?? 1)

    char = CharacterAdapter.selectEx(state.characters, charId)

    if (itemId) {
        char.inventory[slot] = { itemId, quantity }
        removeItem(state, itemId, quantity)
    } else {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete char.inventory[slot]
    }
}
export const equipClick = (charId: string, slot: EquipSlotsEnum, itemId: string | null = null, quantity = 1) =>
    setState((s) => equipItem(s, charId, slot, itemId, quantity))

const addHealthPoints = (state: GameState, charId: string) => {
    const av = getCharacterSelector(charId).AvailableAttributes(state)
    if (av < 1) return

    const charSel = getCharacterSelector(charId)

    const maxPrev = charSel.MaxHealth(state)
    const char = CharacterAdapter.selectEx(state.characters, charId)
    char.healthPoints = char.healthPoints + 1
    const maxNow = charSel.MaxHealth(state)
    const diff = Math.max(maxNow - maxPrev, 0)
    if (diff > 0) {
        const health = Math.min(maxNow, char.health + diff)
        char.health = health
    }
}
export const addHealthPointClick = (charId: string) => setState((s) => addHealthPoints(s, charId))

const addStaminaPoint = (state: GameState, charId: string) => {
    const av = getCharacterSelector(charId).AvailableAttributes(state)
    if (av < 1) return
    const charSel = getCharacterSelector(charId)
    const maxPrev = charSel.MaxStamina(state)
    const char = CharacterAdapter.selectEx(state.characters, PLAYER_ID)
    char.staminaPoints = char.staminaPoints + 1
    const maxNow = charSel.MaxStamina(state)
    const diff = Math.max(maxNow - maxPrev, 0)
    if (diff > 0) {
        const stamina = Math.min(maxNow, char.health + diff)
        char.stamina = stamina
    }
}
export const addStaminaPointClick = (charId: string) => setState((s) => addStaminaPoint(s, charId))

const addManaPoint = (state: GameState, charId: string) => {
    const av = getCharacterSelector(charId).AvailableAttributes(state)
    if (av < 1) return state
    const charSel = getCharacterSelector(charId)
    const maxPrev = charSel.MaxMana(state)
    const char = CharacterAdapter.selectEx(state.characters, PLAYER_ID)
    char.manaPoints = char.manaPoints + 1
    const maxNow = charSel.MaxMana(state)
    const diff = Math.max(maxNow - maxPrev, 0)
    if (diff > 0) {
        const mana = Math.min(maxNow, char.health + diff)
        char.mana = mana
    }
}
export const addManaPointClick = (charId: string) => setState((s) => addManaPoint(s, charId))
