import { Icons } from '../icons/Icons'
import { Msg } from '../msg/Msg'
import { ItemTypes } from './Item'

// ToDo: Add icons for all item types and correct nameIds
export const ItemTypesData: Record<ItemTypes, { nameId: keyof Msg; icon: Icons }> = {
    [ItemTypes.Log]: { nameId: 'Log', icon: Icons.Log },
    [ItemTypes.Plank]: { nameId: 'Plank', icon: Icons.Plank },
    [ItemTypes.Handle]: { nameId: 'Handle', icon: Icons.Handle },
    [ItemTypes.Ore]: { nameId: 'Ore', icon: Icons.Ore },
    [ItemTypes.Gem]: { nameId: 'Gem', icon: Icons.Rupee },
    [ItemTypes.Bar]: { nameId: 'Bar', icon: Icons.Bar },
    [ItemTypes.WoodAxe]: { nameId: 'WoodAxe', icon: Icons.Axe },
    [ItemTypes.Pickaxe]: { nameId: 'Pickaxe', icon: Icons.Pickaxe },
    [ItemTypes.OneHand]: { nameId: 'OneHand', icon: Icons.Dagger },
    [ItemTypes.TwoHands]: { nameId: 'TwoHands', icon: Icons.Broadsword },
    [ItemTypes.Body]: { nameId: 'Body', icon: Icons.Breastplate },
    [ItemTypes.Corpse]: { nameId: 'Corpse', icon: Icons.Skull },
    [ItemTypes.RawFood]: { nameId: 'RawFood', icon: Icons.Steak },
    [ItemTypes.RawSkin]: { nameId: 'RawSkin', icon: Icons.AnimalHide },
    [ItemTypes.Potion]: { nameId: 'Potion', icon: Icons.Potion },
    [ItemTypes.Flask]: { nameId: 'Flask', icon: Icons.RoundPotion },
    [ItemTypes.CraftingIngredient]: { nameId: 'CraftingIngredient', icon: Icons.SwapBag },
    [ItemTypes.Solvent]: { nameId: 'Solvent', icon: Icons.RoundPotion },
}
