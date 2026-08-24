import { describe, expect, test } from 'vitest'
import { GetInitialGameState } from '../game/InitialGameState'
import { GameLocations } from '../gameLocations/GameLocations'
import { GameLocationAdapter } from '../gameLocations/GameLocationAdapter'
import { StdItems } from '../items/stdItems'
import { getVendorOffer, getVendorOffers, getVendorPurchaseOption, VENDOR_DATA } from './VendorData'
import { purchaseVendorItem, purchaseVendorItems, VendorPurchaseResult } from './vendorFunctions'
import { VendorTypes, VendorTypeList } from './VendorTypes'

describe('vendors', () => {
    test('every location sells the base items with unlimited catalog stock', () => {
        for (const location of Object.values(GameLocations)) {
            expect(getVendorOffer(location, VendorTypes.GeneralMerchant, 'DeadTreeLog')).toBeDefined()
            expect(getVendorOffer(location, VendorTypes.Blacksmith, 'CopperOre')).toBeDefined()
            expect(getVendorOffer(location, VendorTypes.Alchemist, 'GlassFlask')).toBeDefined()
            expect(getVendorOffer(location, VendorTypes.Alchemist, 'RedFlower')).toBeDefined()
            expect(getVendorOffer(location, VendorTypes.Alchemist, 'BlueFlower')).toBeDefined()
            expect(getVendorOffer(location, VendorTypes.Alchemist, 'GreenFlower')).toBeDefined()
        }
    })

    test('catalog entries reference existing items and cannot be bought below their sale value', () => {
        for (const location of Object.values(GameLocations)) {
            for (const vendorType of VendorTypeList) {
                for (const offer of getVendorOffers(location, vendorType)) {
                    expect(StdItems[offer.itemId]).toBeDefined()
                    expect(offer.unitPrice).toBeGreaterThanOrEqual(StdItems[offer.itemId]!.value)
                }
            }
        }
    })

    test('vendor multipliers range from x2 to x4', () => {
        for (const vendors of Object.values(VENDOR_DATA)) {
            for (const vendor of vendors) {
                expect(vendor.multiplier).toBeGreaterThanOrEqual(2)
                expect(vendor.multiplier).toBeLessThanOrEqual(4)
            }
        }
    })

    test('applies the optional item multiplier to imported goods', () => {
        const vendor = VENDOR_DATA[GameLocations.StartVillage].find(
            ({ vendorType }) => vendorType === VendorTypes.Blacksmith
        )!
        const item = vendor.items.find(({ itemId }) => itemId === 'CopperOre')!

        expect(item.multiplier).toBeGreaterThan(1)
        expect(getVendorOffer(GameLocations.StartVillage, VendorTypes.Blacksmith, item.itemId)?.unitPrice).toBe(
            Math.ceil(StdItems[item.itemId]!.value * vendor.multiplier * item.multiplier!)
        )
    })

    test('location catalog and prices vary', () => {
        expect(getVendorOffer(GameLocations.WoodVillage, VendorTypes.Alchemist, 'VitalHerb')).toBeDefined()
        expect(getVendorOffer(GameLocations.StartVillage, VendorTypes.Alchemist, 'VitalHerb')).toBeUndefined()
        expect(
            getVendorOffer(GameLocations.WoodVillage, VendorTypes.GeneralMerchant, 'DeadTreeLog')?.unitPrice
        ).not.toBe(getVendorOffer(GameLocations.CapitalCity, VendorTypes.GeneralMerchant, 'DeadTreeLog')?.unitPrice)
    })

    test('finds a purchase option across all vendors in the current location', () => {
        expect(getVendorPurchaseOption(GameLocations.StartVillage, 'CopperOre')?.vendorType).toBe(
            VendorTypes.Blacksmith
        )
        expect(getVendorPurchaseOption(GameLocations.StartVillage, 'OakLog')).toBeUndefined()
    })

    test('purchase spends gold and adds the requested quantity to current location storage', () => {
        const state = GetInitialGameState()
        state.gold = 100
        const offer = getVendorOffer(state.location, VendorTypes.Blacksmith, 'CopperOre')!

        expect(purchaseVendorItem(state, VendorTypes.Blacksmith, 'CopperOre', 3)).toBe(VendorPurchaseResult.Success)
        expect(state.gold).toBe(100 - offer.unitPrice * 3)
        expect(
            GameLocationAdapter.selectEx(state.locations, GameLocations.StartVillage).storage.entries.CopperOre
                ?.quantity
        ).toBe(3)
    })

    test('purchase rejects invalid quantities, unavailable items and insufficient gold without mutations', () => {
        const state = GetInitialGameState()
        state.gold = 1

        expect(purchaseVendorItem(state, VendorTypes.Blacksmith, 'CopperOre', 0)).toBe(
            VendorPurchaseResult.InvalidQuantity
        )
        expect(purchaseVendorItem(state, VendorTypes.Blacksmith, 'OakLog', 1)).toBe(VendorPurchaseResult.ItemNotSold)
        expect(purchaseVendorItem(state, VendorTypes.Blacksmith, 'CopperOre', 1)).toBe(
            VendorPurchaseResult.InsufficientGold
        )
        expect(state.gold).toBe(1)
        expect(GameLocationAdapter.selectEx(state.locations, state.location).storage.ids).toEqual([])
    })

    test('batch purchases are atomic when total gold is insufficient', () => {
        const state = GetInitialGameState()
        const oreOffer = getVendorOffer(state.location, VendorTypes.Blacksmith, 'CopperOre')!
        const logOffer = getVendorOffer(state.location, VendorTypes.GeneralMerchant, 'DeadTreeLog')!
        state.gold = oreOffer.unitPrice + logOffer.unitPrice - 1

        expect(
            purchaseVendorItems(state, [
                { vendorType: VendorTypes.Blacksmith, itemId: 'CopperOre', quantity: 1 },
                { vendorType: VendorTypes.GeneralMerchant, itemId: 'DeadTreeLog', quantity: 1 },
            ])
        ).toBe(VendorPurchaseResult.InsufficientGold)
        expect(state.locations.entries[state.location]?.storage.ids).toEqual([])
    })
})
