import { PLAYER_ID } from '../characters/charactersConst'
import { EquipSlotsEnum } from '../characters/equipSlotsEnum'
import { GameState } from '../game/GameState'
import { selectItem } from '../storage/StorageSelectors'

const DEF_WOODCUTTING_TIME = 3e3
const DEF_WOODCUTTING_DAMAGE = 25

export function getAxe(state: GameState) {
    const axe = state.characters[PLAYER_ID].inventory[EquipSlotsEnum.WoodAxe]
    if (!axe) return
    return selectItem(axe.stdItemId, axe.craftItemId)(state)
}

export const getWoodcuttingTime = (state: GameState) => {
    const axe = getAxe(state)
    return axe?.woodAxeData?.woodcuttingTime ?? DEF_WOODCUTTING_TIME
}

export const getWoodcuttingDamage = (state: GameState) => {
    const axe = getAxe(state)
    return axe?.woodAxeData?.woodcuttingDamage ?? DEF_WOODCUTTING_DAMAGE
}
