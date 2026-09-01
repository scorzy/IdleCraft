import { RAW_VOLUME } from '../caravans/CaravanConst'
import { Icons } from '../icons/Icons'
import { Item, ItemType, CraftingType } from '../items/Item'
import { Materials } from '../items/materials/materials'

export const MiningItems = {
    CopperOre: {
        icon: Icons.Ore,
        id: 'CopperOre',
        nameId: 'Ore',
        materials: { primary: Materials.Copper },
        type: ItemType.Crafting,
        craftingTypes: [CraftingType.Ore],
        value: 5,
        volume: RAW_VOLUME,
    },
    TinOre: {
        icon: Icons.Ore,
        id: 'TinOre',
        nameId: 'Ore',
        type: ItemType.Crafting,
        craftingTypes: [CraftingType.Ore],
        materials: { primary: Materials.Tin },
        value: 10,
        volume: RAW_VOLUME,
    },
    Ruby: {
        icon: Icons.Ore,
        id: 'Ruby',
        nameId: 'Ruby',
        type: ItemType.Crafting,
        craftingTypes: [CraftingType.Gem],
        value: 65,
        volume: RAW_VOLUME,
    },
    Sapphire: {
        icon: Icons.Ore,
        id: 'Sapphire',
        nameId: 'Sapphire',
        type: ItemType.Crafting,
        craftingTypes: [CraftingType.Gem],
        value: 75,
        volume: RAW_VOLUME,
    },
    Emerald: {
        icon: Icons.Ore,
        id: 'Emerald',
        nameId: 'Emerald',
        type: ItemType.Crafting,
        craftingTypes: [CraftingType.Gem],
        value: 85,
        volume: RAW_VOLUME,
    },
} satisfies Record<string, Item>
