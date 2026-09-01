import { describe, expect, it } from 'vitest'
import { ArmourType, CraftingType, EquipmentSlot, ItemType, ToolType, WeaponType } from '../../items/Item'
import { migrateItemTaxonomy } from './itemTaxonomyMigration'

describe('migrateItemTaxonomy', () => {
    it('migrates every legacy item type and the persisted item filter', () => {
        const legacyTypes = [
            'Log',
            'Plank',
            'Handle',
            'Ore',
            'Gem',
            'Bar',
            'Corpse',
            'RawFood',
            'RawSkin',
            'CraftingIngredient',
            'Solvent',
            'Flask',
            'Potion',
            'OneHand',
            'TwoHands',
            'WoodAxe',
            'Pickaxe',
            'Head',
            'Body',
            'Legs',
            'Hands',
            'Feet',
        ]
        const state = {
            craftedItems: {
                entries: Object.fromEntries(legacyTypes.map((type) => [type, { id: type, type }])),
            },
            ui: { itemFilterSubType: 'Crafting', itemFilterType: 'Bar' },
        }

        migrateItemTaxonomy(state)

        for (const legacyType of [
            'Log',
            'Plank',
            'Handle',
            'Ore',
            'Gem',
            'Bar',
            'Corpse',
            'RawFood',
            'RawSkin',
            'CraftingIngredient',
            'Solvent',
        ])
            expect(state.craftedItems.entries[legacyType]?.type).toBe(ItemType.Crafting)
        for (const legacyType of ['OneHand', 'TwoHands'])
            expect(state.craftedItems.entries[legacyType]?.type).toBe(ItemType.Weapon)
        for (const legacyType of ['WoodAxe', 'Pickaxe'])
            expect(state.craftedItems.entries[legacyType]?.type).toBe(ItemType.Tool)
        for (const legacyType of ['Head', 'Body', 'Legs', 'Hands', 'Feet'])
            expect(state.craftedItems.entries[legacyType]?.type).toBe(ItemType.Armour)
        expect(state.craftedItems.entries.Log).toMatchObject({
            type: ItemType.Crafting,
            craftingTypes: [CraftingType.Log],
        })
        expect(state.craftedItems.entries.RawFood).toMatchObject({
            type: ItemType.Crafting,
            craftingTypes: [CraftingType.Food],
        })
        expect(state.craftedItems.entries.CraftingIngredient).toMatchObject({
            type: ItemType.Crafting,
            craftingTypes: [CraftingType.AlchemyIngredient],
        })
        expect(state.craftedItems.entries.OneHand).toMatchObject({
            type: ItemType.Weapon,
            weaponType: WeaponType.OneHand,
        })
        expect(state.craftedItems.entries.Pickaxe).toMatchObject({ type: ItemType.Tool, toolType: ToolType.Pickaxe })
        expect(state.craftedItems.entries.Head).toMatchObject({
            type: ItemType.Armour,
            equipmentSlot: EquipmentSlot.Head,
            armourType: ArmourType.Heavy,
        })
        expect(state.craftedItems.entries.Flask).toMatchObject({ type: ItemType.Consumable })
        expect(state.ui).toEqual({ itemFilterType: ItemType.Crafting, itemFilterDetail: CraftingType.Bar })
    })
})
