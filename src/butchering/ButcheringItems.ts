import { Icons } from '../icons/Icons'
import { Item, ItemTypes } from '../items/Item'

export const ButcheringItems: Record<string, Item> = {
    BoarMeat: {
        id: 'BoarMeat',
        icon: Icons.Steak,
        nameId: 'BoarMeat',
        type: ItemTypes.RawFood,
        value: 5,
    },
}
