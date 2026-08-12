import { Icons } from '../icons/Icons'
import { Item, ItemTypes } from '../items/Item'
import { Materials } from '../items/materials/materials'

export const MiningItems = {
    CopperOre: {
        icon: Icons.Ore,
        id: 'CopperOre',
        nameId: 'Ore',
        materials: { primary: Materials.Copper },
        type: ItemTypes.Ore,
        value: 5,
        volume: 0.02,
    },
    TinOre: {
        icon: Icons.Ore,
        id: 'TinOre',
        nameId: 'Ore',
        type: ItemTypes.Ore,
        materials: { primary: Materials.Tin },
        value: 10,
        volume: 0.02,
    },
    Ruby: {
        icon: Icons.Ore,
        id: 'Ruby',
        nameId: 'Ruby',
        type: ItemTypes.Gem,
        value: 65,
        volume: 0.00005,
    },
    Sapphire: {
        icon: Icons.Ore,
        id: 'Sapphire',
        nameId: 'Sapphire',
        type: ItemTypes.Gem,
        value: 75,
        volume: 0.00005,
    },
    Emerald: {
        icon: Icons.Ore,
        id: 'Emerald',
        nameId: 'Emerald',
        type: ItemTypes.Gem,
        value: 85,
        volume: 0.00005,
    },
} satisfies Record<string, Item>
