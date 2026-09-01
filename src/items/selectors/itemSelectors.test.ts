import { describe, expect, it } from 'vitest'
import { EquipSlotsEnum } from '../../characters/equipSlotsEnum'
import { ExpEnum } from '../../experience/ExpEnum'
import { Effects } from '../../effects/types/Effects'
import { Icons } from '../../icons/Icons'
import { CraftingType, Item, ItemType, WeaponType } from '../Item'
import { filterItem } from './itemSelectors'

describe('filterItem', () => {
    const baseItem: Item = {
        id: 'item1',
        nameId: 'LongSword',
        icon: Icons.Sword,
        value: 100,
        volume: 0.005,
        equipSlot: EquipSlotsEnum.MainHand,
        type: ItemType.Weapon,
        weaponType: WeaponType.OneHand,
        craftingData: { prestige: 1, speedBonus: 2 },
        woodAxeData: undefined,
        craftingWoodAxeData: undefined,
        craftingPickaxeData: undefined,
        pickaxeData: undefined,
        weaponData: undefined,
        armourData: undefined,
    }

    it('returns true if no filter fields are set', () => {
        expect(filterItem(baseItem, {})).toBe(true)
    })

    it('filters by itemId', () => {
        expect(filterItem(baseItem, { itemId: 'item1' })).toBe(true)
        expect(filterItem(baseItem, { itemId: 'item2' })).toBe(false)
    })

    it('filters by nameId', () => {
        expect(filterItem(baseItem, { nameId: 'LongSword' })).toBe(true)
        expect(filterItem(baseItem, { nameId: 'WoodAxe' })).toBe(false)
    })

    it('filters by equipSlot', () => {
        expect(filterItem(baseItem, { equipSlot: EquipSlotsEnum.MainHand })).toBe(true)
        expect(filterItem(baseItem, { equipSlot: EquipSlotsEnum.Body })).toBe(false)
    })

    it('filters by itemType', () => {
        expect(filterItem(baseItem, { itemType: ItemType.Weapon, weaponType: WeaponType.OneHand })).toBe(true)
        expect(filterItem(baseItem, { itemType: ItemType.Crafting, craftingTypes: [CraftingType.Bar] })).toBe(false)
    })

    it('filters by item type details', () => {
        expect(filterItem(baseItem, { weaponType: WeaponType.OneHand })).toBe(true)
        expect(filterItem(baseItem, { craftingTypes: [CraftingType.Bar] })).toBe(false)
    })
    it('requires every requested crafting type', () => {
        const foodAndIngredient: Item = {
            ...baseItem,
            type: ItemType.Crafting,
            craftingTypes: [CraftingType.Food, CraftingType.AlchemyIngredient],
        }

        expect(filterItem(foodAndIngredient, { craftingTypes: [CraftingType.Food] })).toBe(true)
        expect(
            filterItem(foodAndIngredient, { craftingTypes: [CraftingType.Food, CraftingType.AlchemyIngredient] })
        ).toBe(true)
        expect(filterItem(foodAndIngredient, { craftingTypes: [CraftingType.Bar] })).toBe(false)
    })
    it('filters by craftingData', () => {
        expect(filterItem(baseItem, { craftingData: { speedBonus: 1 } })).toBe(true)
        expect(filterItem(baseItem, { craftingData: { speedBonus: 2 } })).toBe(true)
        expect(filterItem(baseItem, { craftingData: { speedBonus: 3 } })).toBe(false)
    })
    it('returns true if no data filters are set', () => {
        expect(filterItem(baseItem, {})).toBe(true)
    })
    it('returns false if item is missing required data for filter', () => {
        const item = { ...baseItem, weaponData: undefined }
        expect(filterItem(item, { weaponData: { attackSpeed: 1 } })).toBe(false)
    })
    it('filters by has: true if item has all specified keys', () => {
        const itemWithWeaponData: Item = {
            ...baseItem,
            weaponData: {
                expType: ExpEnum.OneHanded,
                damage: {},
                attackSpeed: 1,
            },
        }
        expect(filterItem(itemWithWeaponData, { has: ['weaponData'] })).toBe(true)
        expect(filterItem(baseItem, { has: ['weaponData'] })).toBe(false)
    })
    it('filters by has: multiple', () => {
        const itemWithMultiple: Item = {
            ...baseItem,
            weaponData: {
                expType: ExpEnum.OneHanded,
                damage: {},
                attackSpeed: 1,
            },
            armourData: {},
        }
        const itemWithWeaponData: Item = {
            ...baseItem,
            weaponData: {
                expType: ExpEnum.OneHanded,
                damage: {},
                attackSpeed: 1,
            },
        }
        expect(filterItem(itemWithMultiple, { has: ['weaponData', 'armourData'] })).toBe(true)
        expect(filterItem(itemWithWeaponData, { has: ['weaponData', 'armourData'] })).toBe(false)
    })
    it('filters potions by required effects', () => {
        const poison: Item = {
            ...baseItem,
            type: ItemType.Consumable,
            potionData: {
                effects: [{ effect: Effects.DamageStamina, value: 20, duration: 0 }],
            },
        }

        expect(filterItem(poison, { potionEffects: [Effects.DamageStamina] })).toBe(true)
        expect(filterItem(poison, { potionEffects: [Effects.Health] })).toBe(false)
        expect(filterItem(baseItem, { potionEffects: [Effects.DamageStamina] })).toBe(false)
    })
})
