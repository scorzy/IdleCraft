import { EquipSlotsEnum } from '../characters/equipSlotsEnum'
import { ItemTypes } from './Item'

export interface SlotData {
    ItemType: ItemTypes
}

export const SlotsData: { [k in EquipSlotsEnum]: SlotData } = {
    [EquipSlotsEnum.WoodAxe]: {
        ItemType: ItemTypes.WoodAxe,
    },
    [EquipSlotsEnum.Pickaxe]: {
        ItemType: ItemTypes.Pickaxe,
    },
    [EquipSlotsEnum.MainHand]: {
        ItemType: ItemTypes.OneHand,
    },
    [EquipSlotsEnum.TwoHand]: {
        ItemType: ItemTypes.TwoHand,
    },
}
