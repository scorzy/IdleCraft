import { Item, ItemTypes } from '../items/Item'
import { Icons } from '../icons/Icons'

export const MiningItems = {
    CopperOre: {
        icon: Icons.Ore,
        id: 'CopperOre',
        nameId: 'CopperOre',
        type: ItemTypes.Ore,
        value: 5,
    },
    TinOre: {
        icon: Icons.Ore,
        id: 'TinOre',
        nameId: 'TinOre',
        type: ItemTypes.Ore,
        value: 10,
    },
} satisfies { [k: string]: Item }
