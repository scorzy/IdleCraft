import { describe, expect, it } from 'vitest'
import { GetInitialGameState } from '../game/InitialGameState'
import { addItem } from '../storage/storageFunctions'
import { getVendorPurchaseOption } from '../vendors/VendorData'
import { canCraft } from './CraftingSelectors'

const setCopperRecipe = (state: ReturnType<typeof GetInitialGameState>) => {
    state.craftingForm.result = {
        time: 1000,
        requirements: [{ itemId: 'CopperOre', qta: 2 }],
        results: [{ id: 'CopperBar', stdItemId: 'CopperBar', qta: 1 }],
    }
}

describe('canCraft', () => {
    it('is enabled when the required quantity is owned without auto buy', () => {
        const state = GetInitialGameState()
        setCopperRecipe(state)
        addItem(state, 'CopperOre', 2)

        expect(canCraft(state)).toBe(true)
    })

    it('is disabled when the required quantity is missing and auto buy is off', () => {
        const state = GetInitialGameState()
        setCopperRecipe(state)
        addItem(state, 'CopperOre', 1)

        expect(canCraft(state)).toBe(false)
    })

    it('is enabled when auto buy covers the missing quantity and gold is sufficient', () => {
        const state = GetInitialGameState()
        setCopperRecipe(state)
        addItem(state, 'CopperOre', 1)
        state.craftingForm.autoBuy.CopperOre = true
        state.gold = getVendorPurchaseOption(state.location, 'CopperOre')!.unitPrice

        expect(canCraft(state)).toBe(true)
    })

    it('is disabled when auto buy is on but gold is insufficient', () => {
        const state = GetInitialGameState()
        setCopperRecipe(state)
        state.craftingForm.autoBuy.CopperOre = true
        state.gold = 0

        expect(canCraft(state)).toBe(false)
    })
})
