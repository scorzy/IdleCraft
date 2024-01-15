import { PLAYER_ID } from '../../characters/charactersConst'
import { EquipSlotsEnum } from '../../characters/equipSlotsEnum'
import { GameState } from '../../game/GameState'
import { selectGameItem } from '../../storage/StorageSelectors'
import { Item, WoodAxeData } from '../../items/Item'
import { Icons } from '../../icons/Icons'
import { BaseBonus } from '../../bonus/Bonus'
import { CharacterAdapter } from '../../characters/characterAdapter'

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
    return selectGameItem(axe.stdItemId, axe.craftItemId)(state)
}
