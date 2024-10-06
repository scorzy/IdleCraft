import { EquipSlotsEnum } from '../characters/equipSlotsEnum'
import { equipItem } from '../characters/characterFunctions'
import { useGameStore } from '../game/state'

export const changeEquip = (slot: EquipSlotsEnum, axeId: string, charId: string) =>
    useGameStore.setState((s) => {
        return equipItem(s, charId, slot, axeId)
    })
