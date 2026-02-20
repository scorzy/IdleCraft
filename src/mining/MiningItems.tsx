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
    Ruby: {
        icon: Icons.Ore,
        id: 'Ruby',
        nameId: 'Ruby',
        type: ItemTypes.Gem,
        value: 65,
    },
    Sapphire: {
        icon: Icons.Ore,
        id: 'Sapphire',
        nameId: 'Sapphire',
        type: ItemTypes.Gem,
        value: 75,
    },
    Emerald: {
        icon: Icons.Ore,
        id: 'Emerald',
        nameId: 'Emerald',
        type: ItemTypes.Gem,
        value: 85,
    },
} satisfies Record<string, Item>
