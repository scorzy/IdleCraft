import { Icons } from '../icons/Icons'
import { Item, ItemTypes } from '../items/Item'

export const ButcheringItems: Record<string, Item> = {
    WhiteMeat: {
        id: 'WhiteMeat',
        icon: Icons.Steak,
        nameId: 'WhiteMeat',
        type: ItemTypes.RawFood,
        value: 5,
    },
    RedMeat: {
        id: 'RedMeat',
        icon: Icons.Steak,
        nameId: 'RedMeat',
        type: ItemTypes.RawFood,
        value: 6,
    },
    BoarSkin: {
        id: 'BoarSkin',
        icon: Icons.AnimalHide,
        nameId: 'BoarSkin',
        type: ItemTypes.RawSkin,
        value: 5,
    },
}
