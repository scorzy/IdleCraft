import { equipItem } from '../characters/characterFunctions'
import { EquipSlotsEnum } from '../characters/equipSlotsEnum'
import { setState } from '../game/setState'

export const changeEquip = (slot: EquipSlotsEnum, axeId: string, charId: string) =>
    setState((s) => equipItem(s, charId, slot, axeId))
