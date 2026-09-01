import { Icons } from '../icons/Icons'
import { Msg } from '../msg/Msg'
import { CraftingType, EquipmentSlot, ItemType, ToolType, WeaponType } from './Item'

export interface ItemTypeDisplayData {
    icon: Icons
    nameId: keyof Msg
}

export const ItemTypeData: Record<ItemType, ItemTypeDisplayData> = {
    [ItemType.Weapon]: { nameId: 'Weapon', icon: Icons.Sword },
    [ItemType.Armour]: { nameId: 'Armour', icon: Icons.Shield },
    [ItemType.Tool]: { nameId: 'Tool', icon: Icons.Pickaxe },
    [ItemType.Crafting]: { nameId: 'Crafting', icon: Icons.Bar },
    [ItemType.Consumable]: { nameId: 'Consumable', icon: Icons.Potion },
}

export const ItemDetailData: Record<WeaponType | EquipmentSlot | ToolType | CraftingType, ItemTypeDisplayData> = {
    [WeaponType.OneHand]: { nameId: 'OneHand', icon: Icons.Dagger },
    [WeaponType.TwoHands]: { nameId: 'TwoHands', icon: Icons.Broadsword },
    [EquipmentSlot.Head]: { nameId: 'Head', icon: Icons.Helmet },
    [EquipmentSlot.Body]: { nameId: 'Body', icon: Icons.Breastplate },
    [EquipmentSlot.Legs]: { nameId: 'Legs', icon: Icons.Cuisses },
    [EquipmentSlot.Hands]: { nameId: 'Hands', icon: Icons.Gauntlet },
    [EquipmentSlot.Feet]: { nameId: 'Feet', icon: Icons.Boots },
    [ToolType.WoodAxe]: { nameId: 'WoodAxe', icon: Icons.Axe },
    [ToolType.Pickaxe]: { nameId: 'Pickaxe', icon: Icons.Pickaxe },
    [CraftingType.Log]: { nameId: 'Log', icon: Icons.Log },
    [CraftingType.Plank]: { nameId: 'Plank', icon: Icons.Plank },
    [CraftingType.Handle]: { nameId: 'Handle', icon: Icons.Handle },
    [CraftingType.Ore]: { nameId: 'Ore', icon: Icons.Ore },
    [CraftingType.Gem]: { nameId: 'Gem', icon: Icons.Rupee },
    [CraftingType.Bar]: { nameId: 'Bar', icon: Icons.Bar },
    [CraftingType.Corpse]: { nameId: 'Corpse', icon: Icons.Skull },
    [CraftingType.Food]: { nameId: 'Food', icon: Icons.Steak },
    [CraftingType.RawSkin]: { nameId: 'RawSkin', icon: Icons.AnimalHide },
    [CraftingType.AlchemyIngredient]: { nameId: 'AlchemyIngredient', icon: Icons.SwapBag },
    [CraftingType.Solvent]: { nameId: 'Solvent', icon: Icons.RoundPotion },
}
