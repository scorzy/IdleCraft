import { PLAYER_ID } from '../../characters/charactersConst'
import { EquipSlotsEnum } from '../../characters/equipSlotsEnum'
import { GameState } from '../../game/GameState'
import { selectGameItem } from '../../storage/StorageSelectors'
import { PickaxeData } from '../../items/Item'
import { Icons } from '../../icons/Icons'
import { BaseBonus } from '../../bonus/Bonus'
import { CharacterAdapter } from '../../characters/characterAdapter'

export const DEF_PICKAXE: PickaxeData = {
    damage: 20,
    time: 3e3,
    armourPen: 0,
}
export const PickaxeBase: BaseBonus = {
    nameId: 'Base',
    iconId: Icons.Pickaxe,
}
export function selectPickaxe(state: GameState) {
    const axe = CharacterAdapter.selectEx(state.characters, PLAYER_ID).inventory[EquipSlotsEnum.Pickaxe]
    if (!axe) return
    return selectGameItem(axe.itemId)(state)
}
