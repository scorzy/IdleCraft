import { EquipSlotsEnum } from '../characters/equipSlotsEnum'
import { ItemTypes } from './Item'

export interface SlotData {
    ItemType: ItemTypes
}

export const SlotsData: Record<EquipSlotsEnum, SlotData> = {
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
        ItemType: ItemTypes.TwoHands,
    },
    [EquipSlotsEnum.Head]: {
        ItemType: ItemTypes.Head,
    },
    [EquipSlotsEnum.Body]: {
        ItemType: ItemTypes.Body,
    },
    [EquipSlotsEnum.Legs]: {
        ItemType: ItemTypes.Legs,
    },
    [EquipSlotsEnum.Hands]: {
        ItemType: ItemTypes.Hands,
    },
    [EquipSlotsEnum.Feet]: {
        ItemType: ItemTypes.Feet,
    },
    [EquipSlotsEnum.QuickSlot]: {
        ItemType: ItemTypes.Potion,
    },
}
