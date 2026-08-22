import { describe, expect, test } from 'vitest'
import { GetInitialGameState } from '../game/InitialGameState'
import { GameLocations } from '../gameLocations/GameLocations'
import { GameLocationAdapter } from '../gameLocations/GameLocationAdapter'
import { StdItems } from '../items/stdItems'
import { getVendorOffer, getVendorOffers } from './VendorData'
import { purchaseVendorItem, VendorPurchaseResult } from './vendorFunctions'
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

    test('location catalog and prices vary', () => {
        expect(getVendorOffer(GameLocations.WoodVillage, VendorTypes.Alchemist, 'VitalHerb')).toBeDefined()
        expect(getVendorOffer(GameLocations.StartVillage, VendorTypes.Alchemist, 'VitalHerb')).toBeUndefined()
        expect(
            getVendorOffer(GameLocations.WoodVillage, VendorTypes.GeneralMerchant, 'DeadTreeLog')?.unitPrice
        ).not.toBe(getVendorOffer(GameLocations.CapitalCity, VendorTypes.GeneralMerchant, 'DeadTreeLog')?.unitPrice)
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
})
