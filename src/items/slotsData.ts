import { EquipSlotsEnum } from '../characters/equipSlotsEnum'
import { EquipmentSlot, ItemFilter, ItemType, ToolType, WeaponType } from './Item'

export interface SlotData {
    itemFilter: ItemFilter
    nameId: ItemFilter['nameId']
}

export const SlotsData: Record<EquipSlotsEnum, SlotData> = {
    [EquipSlotsEnum.WoodAxe]: {
        itemFilter: { itemType: ItemType.Tool, toolType: ToolType.WoodAxe },
        nameId: 'WoodAxe',
    },
    [EquipSlotsEnum.Pickaxe]: {
        itemFilter: { itemType: ItemType.Tool, toolType: ToolType.Pickaxe },
        nameId: 'Pickaxe',
    },
    [EquipSlotsEnum.MainHand]: {
        itemFilter: { itemType: ItemType.Weapon, weaponType: WeaponType.OneHand },
        nameId: 'OneHand',
    },
    [EquipSlotsEnum.TwoHand]: {
        itemFilter: { itemType: ItemType.Weapon, weaponType: WeaponType.TwoHands },
        nameId: 'TwoHands',
    },
    [EquipSlotsEnum.Head]: {
        itemFilter: { itemType: ItemType.Armour, equipmentSlot: EquipmentSlot.Head },
        nameId: 'Head',
    },
    [EquipSlotsEnum.Body]: {
        itemFilter: { itemType: ItemType.Armour, equipmentSlot: EquipmentSlot.Body },
        nameId: 'Body',
    },
    [EquipSlotsEnum.Legs]: {
        itemFilter: { itemType: ItemType.Armour, equipmentSlot: EquipmentSlot.Legs },
        nameId: 'Legs',
    },
    [EquipSlotsEnum.Hands]: {
        itemFilter: { itemType: ItemType.Armour, equipmentSlot: EquipmentSlot.Hands },
        nameId: 'Hands',
    },
    [EquipSlotsEnum.Feet]: {
        itemFilter: { itemType: ItemType.Armour, equipmentSlot: EquipmentSlot.Feet },
        nameId: 'Feet',
    },
    [EquipSlotsEnum.QuickSlot]: {
        itemFilter: { itemType: ItemType.Consumable, has: ['potionData'] },
        nameId: 'Potion',
    },
}
