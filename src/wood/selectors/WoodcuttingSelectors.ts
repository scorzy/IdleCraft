import { PLAYER_ID } from '../../characters/charactersConst'
import { EquipSlotsEnum } from '../../characters/equipSlotsEnum'
import { GameState } from '../../game/GameState'
import { selectGameItem } from '../../storage/StorageSelectors'
import { Item, WoodAxeData } from '../../items/Item'
import { Icons } from '../../icons/Icons'
import { BaseBonus } from '../../bonus/Bonus'
import { CharacterAdapter } from '../../characters/characterAdapter'
import { WoodTypes } from '../WoodTypes'
import { selectLevelExp } from '../../experience/expSelectors'
import { ExpEnum } from '../../experience/expEnum'
import { WoodData } from '../WoodData'

export const DEF_WOOD_AXE: WoodAxeData = {
    damage: 25,
    time: 3e3,
}
export const WoodBase: BaseBonus = {
    nameId: 'Base',
    iconId: Icons.Axe,
}

export function selectAxe(state: GameState): Item | undefined {
    const axe = CharacterAdapter.selectEx(state.characters, PLAYER_ID).inventory[EquipSlotsEnum.WoodAxe]
    if (!axe) return
    return selectGameItem(axe.itemId)(state)
}

export const isWoodEnabled = (woodType: WoodTypes) => (state: GameState) => {
    const woodLevel = selectLevelExp(ExpEnum.Woodcutting, PLAYER_ID)(state)
    const data = WoodData[woodType]
    return woodLevel >= data.requiredLevel
}

export const isSelectedWoodEnabled = (state: GameState) => {
    const woodType = state.ui.woodType
    const woodLevel = selectLevelExp(ExpEnum.Woodcutting, PLAYER_ID)(state)
    const data = WoodData[woodType]
    return woodLevel >= data.requiredLevel
}
