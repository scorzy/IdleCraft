import { CharacterAdapter } from '../characters/characterAdapter'
import { PLAYER_ID } from '../characters/charactersConst'
import { EquipSlotsEnum } from '../characters/equipSlotsEnum'
import { GameState } from '../game/GameState'
import { selectGameItem } from '../storage/StorageSelectors'
import { getItemId2 } from '../storage/storageFunctions'

export const selectEquippedItem =
    (slot: EquipSlotsEnum, characterId = PLAYER_ID) =>
    (state: GameState) => {
        const equipped = CharacterAdapter.selectEx(state.characters, characterId).inventory[slot]
        if (!equipped) return
        return selectGameItem(equipped.stdItemId, equipped.craftItemId)(state)
    }
export const selectSelectedCharEquippedItem = (slot: EquipSlotsEnum) => (state: GameState) => {
    const equipped = CharacterAdapter.selectEx(state.characters, state.ui.selectedCharId).inventory[slot]
    if (!equipped) return
    return selectGameItem(equipped.stdItemId, equipped.craftItemId)(state)
}

export const selectEquipId =
    (slot: EquipSlotsEnum, characterId = PLAYER_ID) =>
    (state: GameState) => {
        const equipped = CharacterAdapter.selectEx(state.characters, characterId).inventory[slot]
        if (!equipped) return
        return getItemId2(equipped.stdItemId, equipped.craftItemId)
    }
