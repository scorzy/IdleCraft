import { Icons } from '../icons/Icons'
import { Item, ItemTypes } from '../items/Item'
import { Materials } from '../items/materials/materials'

export const SmithingItems: Record<string, Item> = {
    CopperBar: {
        id: 'CopperBar',
        icon: Icons.Bar,
        nameId: 'Bar',
        type: ItemTypes.Bar,
        value: 10,
        materials: { primary: Materials.Copper },
        craftingData: {
            prestige: 1.05,
            speedBonus: 1.1,
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
            time: 4e3,
        },
        craftingPickaxeData: {
            damage: 15,
            armourPen: 0,
            time: 4e3,
        },
    },
    TinBar: {
        id: 'TinBar',
        icon: Icons.Bar,
        nameId: 'Bar',
        type: ItemTypes.Bar,
        value: 20,
        materials: { primary: Materials.Tin },
        craftingData: {
            prestige: 1.1,
            speedBonus: 1,
            damage: {
                Bludgeoning: 1.2,
                Piercing: 1.2,
                Slashing: 1.2,
            },
            armour: {
                Bludgeoning: 1.2,
                Piercing: 1.2,
                Slashing: 1.2,
            },
        },
        craftingWoodAxeData: {
            damage: 60,
            time: 4e3,
        },
        craftingPickaxeData: {
            damage: 20,
            armourPen: 1,
            time: 4e3,
        },
    },
}
