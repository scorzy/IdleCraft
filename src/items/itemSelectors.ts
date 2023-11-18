import { PLAYER_ID } from '../characters/charactersConst'
import { EquipSlotsEnum } from '../characters/equipSlotsEnum'
import { GameState } from '../game/GameState'
import { selectGameItem } from '../storage/StorageSelectors'
import { getItemId2 } from '../storage/storageFunctions'

export const selectEquippedItem = (slot: EquipSlotsEnum) => (state: GameState) => {
    const equipped = state.characters[PLAYER_ID]!.inventory[slot]
    if (!equipped) return
    return selectGameItem(equipped.stdItemId, equipped.craftItemId)(state)
}
export const selectEquipId = (slot: EquipSlotsEnum) => (state: GameState) => {
    const equipped = state.characters[PLAYER_ID]!.inventory[slot]
    if (!equipped) return
    return getItemId2(equipped.stdItemId, equipped.craftItemId)
}
