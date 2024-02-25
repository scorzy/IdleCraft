import { Icons } from '../icons/Icons'
import { Item, ItemTypes } from '../items/Item'

export const SmithingItems: Record<string, Item> = {
    TinBar: {
        id: 'TinBar',
        icon: Icons.Bar,
        nameId: 'TinBar',
        type: ItemTypes.Bar,
        value: 10,
        craftingData: {
            prestige: 1.1,
            speedBonus: 1,
            damage: {
                Bludgeoning: 1,
                Piercing: 1,
                Slashing: 1,
            },
            armour: {
                Bludgeoning: 1,
                Piercing: 1,
                Slashing: 1,
            },
        },
        craftingWoodAxeData: {
            damage: 50,
            time: 3e3,
        },
        craftingPickaxeData: {
            damage: 10,
            armourPen: 0,
            time: 3e3,
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
            speedBonus: 1.1,
            damage: {
                Bludgeoning: 1.1,
                Piercing: 1.1,
                Slashing: 1.1,
            },
            armour: {
                Bludgeoning: 1.1,
                Piercing: 1.1,
                Slashing: 1.1,
            },
        },
        craftingWoodAxeData: {
            damage: 60,
            time: 3e3,
        },
        craftingPickaxeData: {
            damage: 15,
            armourPen: 1,
            time: 3e3,
        },
    },
}
