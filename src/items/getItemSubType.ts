import { ItemSubType, ItemTypes } from './Item'

export const getItemSubType = (itemType: ItemTypes): ItemSubType => {
    switch (itemType) {
        case ItemTypes.WoodAxe:
        case ItemTypes.Pickaxe:
            return ItemSubType.Tool
        case ItemTypes.OneHand:
        case ItemTypes.TwoHands:
            return ItemSubType.Weapon
        case ItemTypes.Body:
            return ItemSubType.Armour
        case ItemTypes.Log:
        case ItemTypes.Plank:
        case ItemTypes.Handle:
        case ItemTypes.Ore:
        case ItemTypes.Gem:
        case ItemTypes.Bar:
        case ItemTypes.Corpse:
        case ItemTypes.RawFood:
        case ItemTypes.RawSkin:
        case ItemTypes.CraftingIngredient:
        case ItemTypes.Solvent:
            return ItemSubType.Crafting
        case ItemTypes.Potion:
        case ItemTypes.Flask:
            return ItemSubType.Potion
    }
}
