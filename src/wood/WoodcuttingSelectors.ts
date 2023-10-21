import { PLAYER_ID } from '../characters/charactersConst'
import { EquipSlotsEnum } from '../characters/equipSlotsEnum'
import { GameState } from '../game/GameState'
import { selectGameItem } from '../storage/StorageSelectors'
import { WoodAxeData } from '../items/Item'
import { getItemId2 } from '../storage/storageFunctions'

export const DEF_WOOD_AXE: WoodAxeData = {
    damage: 25,
    time: 3e3,
}

export function selectAxe(state: GameState) {
    const axe = state.characters[PLAYER_ID].inventory[EquipSlotsEnum.WoodAxe]
    if (!axe) return
    return selectGameItem(axe.stdItemId, axe.craftItemId)(state)
}

export const getWoodcuttingTime = (state: GameState) => {
    const axe = selectAxe(state)
    return axe?.woodAxeData?.time ?? DEF_WOOD_AXE.time
}

export const getWoodcuttingDamage = (state: GameState) => {
    const axe = selectAxe(state)
    return axe?.woodAxeData?.damage ?? DEF_WOOD_AXE.damage
}

export function selectAxeId(state: GameState) {
    const axe = state.characters[PLAYER_ID].inventory[EquipSlotsEnum.WoodAxe]
    if (!axe) return
    return getItemId2(axe.stdItemId, axe.craftItemId)
}
