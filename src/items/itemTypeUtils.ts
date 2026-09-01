import { CraftingType, Item, ItemDetailType, ItemType } from './Item'

export const hasCraftingTypes = (item: Item, craftingTypes: CraftingType[]) =>
    item.type === ItemType.Crafting && craftingTypes.every((craftingType) => item.craftingTypes.includes(craftingType))

export const matchesItemDetail = (item: Item, detail: ItemDetailType) => {
    if (item.type === ItemType.Weapon) return item.weaponType === detail
    if (item.type === ItemType.Armour) return item.equipmentSlot === detail
    if (item.type === ItemType.Tool) return item.toolType === detail
    if (item.type === ItemType.Crafting) return item.craftingTypes.includes(detail as CraftingType)
    return false
}
