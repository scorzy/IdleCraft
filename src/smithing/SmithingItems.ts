import { REFINED_VOLUME } from '../caravans/CaravanConst'
import { Icons } from '../icons/Icons'
import { Item, ItemType, CraftingType } from '../items/Item'
import { Materials } from '../items/materials/materials'

export const SmithingItems: Record<string, Item> = {
    CopperBar: {
        id: 'CopperBar',
        icon: Icons.Bar,
        nameId: 'Bar',
        type: ItemType.Crafting,
        craftingTypes: [CraftingType.Bar],
        value: 10,
        volume: REFINED_VOLUME,
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
            damage: 30,
            time: 4e3,
        },
        craftingPickaxeData: {
            damage: 30,
            armourPen: 1,
            time: 4e3,
        },
    },
    TinBar: {
        id: 'TinBar',
        icon: Icons.Bar,
        nameId: 'Bar',
        type: ItemType.Crafting,
        craftingTypes: [CraftingType.Bar],
        value: 20,
        volume: REFINED_VOLUME,
        materials: { primary: Materials.Tin },
        craftingData: {
            prestige: 1.1,
            speedBonus: 1,
            damage: {
                Bludgeoning: 1.5,
                Piercing: 1.5,
                Slashing: 1.5,
            },
            armour: {
                Bludgeoning: 1.5,
                Piercing: 1.5,
                Slashing: 1.5,
            },
        },
        craftingWoodAxeData: {
            damage: 45,
            time: 4e3,
        },
        craftingPickaxeData: {
            damage: 45,
            armourPen: 2,
            time: 4e3,
        },
    },
}
