import { EquipSlotsEnum } from '../characters/equipSlotsEnum'
import { equipItem } from '../characters/characterFunctions'
import { setState } from '../game/state'

export const changeEquip = (slot: EquipSlotsEnum, axeId: string, charId: string) =>
    setState((s) => equipItem(s, charId, slot, axeId))
