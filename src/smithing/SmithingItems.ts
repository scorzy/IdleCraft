import { Icons } from '../icons/Icons'
import { Item, ItemTypes } from '../items/Item'

export const SmithingItems = {
    TinBar: {
        id: 'TinBar',
        icon: Icons.Bar,
        nameId: 'TinBar',
        type: ItemTypes.Bar,
        value: 10,
    },
    CopperBar: {
        id: 'CopperBar',
        icon: Icons.Bar,
        nameId: 'CopperBar',
        type: ItemTypes.Bar,
        value: 20,
    },
} satisfies { [k: string]: Item }
