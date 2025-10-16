import { Item, ItemTypes } from '../items/Item'
import { Icons } from '../icons/Icons'
import { Materials } from '../items/materials/materials'

export const MiningItems = {
    CopperOre: {
        icon: Icons.Ore,
        id: 'CopperOre',
        nameId: 'Ore',
        materials: { primary: Materials.Copper },
        type: ItemTypes.Ore,
        value: 5,
    },
    TinOre: {
        icon: Icons.Ore,
        id: 'TinOre',
        nameId: 'Ore',
        type: ItemTypes.Ore,
        materials: { primary: Materials.Tin },
        value: 10,
    },
} satisfies Record<string, Item>
