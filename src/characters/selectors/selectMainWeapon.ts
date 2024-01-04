import { GameState } from '../../game/GameState'
import { selectEquippedItem } from '../../items/itemSelectors'
import { EquipSlotsEnum } from '../equipSlotsEnum'

export const selectMainWeapon = (charId: string) => (state: GameState) => {
    return (
        selectEquippedItem(EquipSlotsEnum.MainHand, charId)(state) ??
        selectEquippedItem(EquipSlotsEnum.TwoHand, charId)(state)
    )
}
