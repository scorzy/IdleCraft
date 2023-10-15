import { Icons } from '../icons/Icons'
import { Item, ItemTypes } from '../items/Item'

export const SmithingItems = {
    TinBar: {
        id: 'TinBar',
        icon: Icons.Bar,
        nameId: 'TinBar',
        type: ItemTypes.Bar,
        value: 10,
        craftingData: {
            prestige: 1.1,
        },
        craftingWoodAxeData: {
            woodcuttingDamage: 50,
            woodcuttingTime: 3e3,
        },
    },
    CopperBar: {
        id: 'CopperBar',
        icon: Icons.Bar,
        nameId: 'CopperBar',
        type: ItemTypes.Bar,
        value: 20,
        craftingData: {
            prestige: 1.2,
        },
        craftingWoodAxeData: {
            woodcuttingDamage: 60,
            woodcuttingTime: 3e3,
        },
    },
} satisfies { [k: string]: Item }
