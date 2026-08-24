import { describe, expect, it } from 'vitest'
import { GetInitialGameState } from '../../game/InitialGameState'
import { addItem } from '../../storage/storageFunctions'
import { getVendorPurchaseOption } from '../../vendors/VendorData'
import { RecipeResult } from '../RecipeInterfaces'
import { getCraftingPurchasePlan, purchaseCraftingRequirements } from './autoBuyCrafting'

const makeResult = (requirements: RecipeResult['requirements']): RecipeResult => ({
    time: 1000,
    requirements,
    results: [],
})

describe('crafting auto buy', () => {
    it('buys only the missing quantity of an enabled vendor item', () => {
        const state = GetInitialGameState()
        const result = makeResult([{ itemId: 'CopperOre', qta: 3 }])
        const offer = getVendorPurchaseOption(state.location, 'CopperOre')!
        state.gold = offer.unitPrice * 2
        addItem(state, 'CopperOre', 1)

        expect(getCraftingPurchasePlan(state, result, { CopperOre: true })).toMatchObject({
            lines: [{ itemId: 'CopperOre', quantity: 2, unitPrice: offer.unitPrice, cost: offer.unitPrice * 2 }],
            totalCost: offer.unitPrice * 2,
            canCraft: true,
        })

        expect(purchaseCraftingRequirements(state, result, { CopperOre: true })).toBe(true)
        expect(state.gold).toBe(0)
        expect(state.locations.entries[state.location]?.storage.entries.CopperOre?.quantity).toBe(3)
    })

    it('does not buy a missing item when auto buy is disabled', () => {
        const state = GetInitialGameState()
        const result = makeResult([{ itemId: 'CopperOre', qta: 1 }])
        state.gold = 1000

        expect(getCraftingPurchasePlan(state, result, {})).toMatchObject({
            missingItemIds: ['CopperOre'],
            hasEnoughGold: true,
            canCraft: false,
        })
        expect(purchaseCraftingRequirements(state, result, {})).toBe(false)
        expect(state.gold).toBe(1000)
        expect(state.locations.entries[state.location]?.storage.entries.CopperOre).toBeUndefined()
    })

    it('rejects an unaffordable multi-item purchase without partial mutations', () => {
        const state = GetInitialGameState()
        const result = makeResult([
            { itemId: 'CopperOre', qta: 1 },
            { itemId: 'DeadTreeLog', qta: 1 },
        ])
        const copperCost = getVendorPurchaseOption(state.location, 'CopperOre')!.unitPrice
        const logCost = getVendorPurchaseOption(state.location, 'DeadTreeLog')!.unitPrice
        state.gold = copperCost + logCost - 1

        const autoBuy = { CopperOre: true, DeadTreeLog: true }
        expect(getCraftingPurchasePlan(state, result, autoBuy)).toMatchObject({
            missingItemIds: [],
            hasEnoughGold: false,
            canCraft: false,
        })
        expect(purchaseCraftingRequirements(state, result, autoBuy)).toBe(false)
        expect(state.gold).toBe(copperCost + logCost - 1)
        expect(state.locations.entries[state.location]?.storage.ids).toEqual([])
    })

    it('allows crafting without spending when all requirements are already owned', () => {
        const state = GetInitialGameState()
        const result = makeResult([{ itemId: 'CopperOre', qta: 1 }])
        addItem(state, 'CopperOre', 1)

        expect(getCraftingPurchasePlan(state, result, {})).toEqual({
            lines: [],
            totalCost: 0,
            missingItemIds: [],
            hasEnoughGold: true,
            canCraft: true,
        })
        expect(purchaseCraftingRequirements(state, result, {})).toBe(true)
    })
})
