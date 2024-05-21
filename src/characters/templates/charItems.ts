import { Icons } from '../../icons/Icons'
import { Item, ItemTypes } from '../../items/Item'

export const CharItems: Record<string, Item> = {
    DeadBoar: {
        id: 'DeadBoar',
        icon: Icons.Boar,
        nameId: 'DeadBoar',
        type: ItemTypes.Corpse,
        value: 5,
    },
}
