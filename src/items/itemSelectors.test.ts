import { describe, it, expect } from 'vitest'
import { EquipSlotsEnum } from '../characters/equipSlotsEnum'
import { Icons } from '../icons/Icons'
import { filterItem } from './itemSelectors'
import { Item, ItemFilter, ItemSubType, ItemTypes } from './Item'

describe('filterItem', () => {
    const baseItem: Item = {
        id: 'item1',
        nameId: 'LongSword',
        icon: Icons.Sword,
        value: 100,
        equipSlot: EquipSlotsEnum.MainHand,
        type: ItemTypes.OneHand,
        subType: ItemSubType.Weapon,
        craftingData: { prestige: 1, speedBonus: 2 },
        woodAxeData: undefined,
        craftingWoodAxeData: undefined,
        craftingPickaxeData: undefined,
        pickaxeData: undefined,
        weaponData: undefined,
        armourData: undefined,
    }

    it('returns true if no filter fields are set', () => {
        expect(filterItem(baseItem, {} as ItemFilter)).toBe(true)
    })

    it('filters by itemId', () => {
        expect(filterItem(baseItem, { itemId: 'item1' } as ItemFilter)).toBe(true)
        expect(filterItem(baseItem, { itemId: 'item2' } as ItemFilter)).toBe(false)
    })

    it('filters by nameId', () => {
        expect(filterItem(baseItem, { nameId: 'LongSword' } as ItemFilter)).toBe(true)
        expect(filterItem(baseItem, { nameId: 'WoodAxe' } as ItemFilter)).toBe(false)
    })

    it('filters by equipSlot', () => {
        expect(filterItem(baseItem, { equipSlot: EquipSlotsEnum.MainHand } as ItemFilter)).toBe(true)
        expect(filterItem(baseItem, { equipSlot: EquipSlotsEnum.Body } as ItemFilter)).toBe(false)
    })

    it('filters by itemType', () => {
        expect(filterItem(baseItem, { itemType: ItemTypes.OneHand } as ItemFilter)).toBe(true)
        expect(filterItem(baseItem, { itemType: ItemTypes.Bar } as ItemFilter)).toBe(false)
    })

    it('filters by itemSubType', () => {
        expect(filterItem(baseItem, { itemSubType: ItemSubType.Weapon } as ItemFilter)).toBe(true)
        expect(filterItem(baseItem, { itemSubType: ItemSubType.Crafting } as ItemFilter)).toBe(false)
    })
    it('filters by craftingData', () => {
        expect(filterItem(baseItem, { craftingData: { speedBonus: 2 } } as ItemFilter)).toBe(true)
        expect(filterItem(baseItem, { craftingData: { speedBonus: 3 } } as ItemFilter)).toBe(false)
    })
    it('returns true if no data filters are set', () => {
        expect(filterItem(baseItem, {} as ItemFilter)).toBe(true)
    })
    it('returns false if item is missing required data for filter', () => {
        const item = { ...baseItem, weaponData: undefined }
        expect(filterItem(item, { weaponData: { attackSpeed: 1 } } as ItemFilter)).toBe(false)
    })
})
