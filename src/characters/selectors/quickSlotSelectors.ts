import { EMPTY_ARRAY } from '../../const'
import { GameState } from '../../game/GameState'
import { selectGameItem } from '../../storage/StorageSelectors'
import { PLAYER_ID } from '../charactersConst'
import { EquipSlotsEnum } from '../equipSlotsEnum'

export const quickSlotEquipSlots: EquipSlotsEnum[] = [EquipSlotsEnum.QuickSlot]

export const getQuickSlotEquipSlot = (index: number) => quickSlotEquipSlots[index]

export const selectQuickSlots =
    (charId = PLAYER_ID) =>
    (state: GameState) => {
        const char = state.characters.entries[charId]
        return char ? quickSlotEquipSlots.map((slot) => char.inventory[slot] ?? null) : EMPTY_ARRAY
    }

export const selectQuickSlot =
    (index: number, charId = PLAYER_ID) =>
    (state: GameState) => {
        const slot = getQuickSlotEquipSlot(index)
        return slot ? (state.characters.entries[charId]?.inventory[slot] ?? null) : null
    }

export const selectQuickSlotItem =
    (index: number, charId = PLAYER_ID) =>
    (state: GameState) => {
        const quickSlot = selectQuickSlot(index, charId)(state)
        return quickSlot ? selectGameItem(quickSlot.itemId)(state) : undefined
    }

export const selectIsQuickSlotEquipped =
    (itemId: string, charId = PLAYER_ID) =>
    (state: GameState) =>
        selectQuickSlots(charId)(state).some((slot) => slot?.itemId === itemId)
