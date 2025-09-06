import { CharacterAdapter } from '../../characters/characterAdapter'
import { PLAYER_ID } from '../../characters/charactersConst'
import { EquipSlotsEnum } from '../../characters/equipSlotsEnum'
import { GameState } from '../../game/GameState'
import { Item } from '../../items/Item'
import { selectGameItem } from '../../storage/StorageSelectors'

export function selectPickaxe(state: GameState): Item | undefined {
    const axe = CharacterAdapter.selectEx(state.characters, PLAYER_ID).inventory[EquipSlotsEnum.Pickaxe]
    if (!axe) return
    return selectGameItem(axe.itemId)(state)
}
