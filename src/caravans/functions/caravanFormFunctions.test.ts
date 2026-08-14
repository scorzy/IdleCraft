import { describe, expect, test } from 'vitest'
import { GetInitialGameState } from '../../game/InitialGameState'
import { GameLocations } from '../../gameLocations/GameLocations'
import { addItem } from '../../storage/storageFunctions'
import { CaravanTierId } from '../CaravanConst'
import {
    addCargoItem,
    caravanOnItemDecrease,
    caravanOnItemRemove,
    confirmDispatch,
    loadAllStorageAsCargo,
    removeCargoLine,
    resetCaravanForm,
    setCargoLineQty,
    setCaravanDestination,
    setCaravanTier,
} from './caravanFormFunctions'
import { DispatchResult } from './dispatch'

function stateReady() {
    const state = GetInitialGameState()
    state.isTimer = true
    state.gold = 1_000_000
    addItem(state, 'OakLog', 500, GameLocations.StartVillage)
    addItem(state, 'CopperOre', 50, GameLocations.StartVillage)
    return state
}

describe('caravanFormFunctions', () => {
    test('setCaravanDestination/setCaravanTier update the form', () => {
        const state = stateReady()
        setCaravanDestination(state, GameLocations.WoodVillage)
        setCaravanTier(state, CaravanTierId.Standard)
        expect(state.caravanDispatchForm.toId).toBe(GameLocations.WoodVillage)
        expect(state.caravanDispatchForm.tierId).toBe(CaravanTierId.Standard)
    })

    test('setCargoLineQty adds, updates and removes a cargo line', () => {
        const state = stateReady()
        setCargoLineQty(state, 'OakLog', 100)
        expect(state.caravanDispatchForm.cargo).toEqual([{ itemId: 'OakLog', quantity: 100 }])

        setCargoLineQty(state, 'OakLog', 50)
        expect(state.caravanDispatchForm.cargo).toEqual([{ itemId: 'OakLog', quantity: 50 }])

        setCargoLineQty(state, 'OakLog', 0)
        expect(state.caravanDispatchForm.cargo).toEqual([])
    })

    test('addCargoItem preloads the quantity available in the current storage', () => {
        const state = stateReady()
        addCargoItem(state, 'OakLog')
        expect(state.caravanDispatchForm.cargo).toEqual([{ itemId: 'OakLog', quantity: 500 }])
    })

    test('addCargoItem does not add an item missing from storage', () => {
        const state = stateReady()
        addCargoItem(state, 'TinOre')
        expect(state.caravanDispatchForm.cargo).toEqual([])
    })

    test('removeCargoLine removes only the specified line', () => {
        const state = stateReady()
        setCargoLineQty(state, 'OakLog', 100)
        setCargoLineQty(state, 'CopperOre', 10)
        removeCargoLine(state, 'OakLog')
        expect(state.caravanDispatchForm.cargo).toEqual([{ itemId: 'CopperOre', quantity: 10 }])
    })

    test('loadAllStorageAsCargo preloads the entire storage of the current location', () => {
        const state = stateReady()
        loadAllStorageAsCargo(state)
        expect(state.caravanDispatchForm.cargo).toEqual(
            expect.arrayContaining([
                { itemId: 'OakLog', quantity: 500 },
                { itemId: 'CopperOre', quantity: 50 },
            ])
        )
        expect(state.caravanDispatchForm.cargo).toHaveLength(2)
    })

    test('resetCaravanForm clears destination, tier and cargo', () => {
        const state = stateReady()
        setCaravanDestination(state, GameLocations.WoodVillage)
        setCaravanTier(state, CaravanTierId.Standard)
        setCargoLineQty(state, 'OakLog', 10)

        resetCaravanForm(state)

        expect(state.caravanDispatchForm).toEqual({ toId: undefined, tierId: undefined, cargo: [] })
    })

    test('confirmDispatch dispatches, clears the form and selects the new shipment', () => {
        const state = stateReady()
        setCaravanDestination(state, GameLocations.WoodVillage)
        setCaravanTier(state, CaravanTierId.Standard)
        setCargoLineQty(state, 'OakLog', 100)

        const result = confirmDispatch(state)

        expect(result).toBe(DispatchResult.Dispatched)
        expect(state.caravanDispatchForm).toEqual({ toId: undefined, tierId: undefined, cargo: [] })
        expect(state.ui.selectedShipmentId).toBeDefined()
        expect(state.shipments.ids).toContain(state.ui.selectedShipmentId)
    })

    test('confirmDispatch without destination/tier does not mutate state', () => {
        const state = stateReady()
        setCargoLineQty(state, 'OakLog', 100)
        const before = structuredClone(state)

        const result = confirmDispatch(state)

        expect(result).toBe(DispatchResult.InvalidRoute)
        expect(state).toEqual(before)
    })

    test('caravanOnItemDecrease shrinks a staged cargo line that now exceeds the available quantity', () => {
        const state = stateReady()
        setCargoLineQty(state, 'OakLog', 100)

        caravanOnItemDecrease(state, 'OakLog', GameLocations.StartVillage, 40)

        expect(state.caravanDispatchForm.cargo).toEqual([{ itemId: 'OakLog', quantity: 40 }])
    })

    test('caravanOnItemDecrease removes the cargo line when the item is fully gone', () => {
        const state = stateReady()
        setCargoLineQty(state, 'OakLog', 100)

        caravanOnItemDecrease(state, 'OakLog', GameLocations.StartVillage, 0)

        expect(state.caravanDispatchForm.cargo).toEqual([])
    })

    test('caravanOnItemDecrease leaves the cargo line untouched when still within the available quantity', () => {
        const state = stateReady()
        setCargoLineQty(state, 'OakLog', 100)

        caravanOnItemDecrease(state, 'OakLog', GameLocations.StartVillage, 200)

        expect(state.caravanDispatchForm.cargo).toEqual([{ itemId: 'OakLog', quantity: 100 }])
    })

    test('caravanOnItemDecrease ignores changes from a different location', () => {
        const state = stateReady()
        setCargoLineQty(state, 'OakLog', 100)

        caravanOnItemDecrease(state, 'OakLog', GameLocations.WoodVillage, 0)

        expect(state.caravanDispatchForm.cargo).toEqual([{ itemId: 'OakLog', quantity: 100 }])
    })

    test('caravanOnItemRemove removes the staged cargo line for the removed item', () => {
        const state = stateReady()
        setCargoLineQty(state, 'OakLog', 100)
        setCargoLineQty(state, 'CopperOre', 10)

        caravanOnItemRemove(state, 'OakLog', GameLocations.StartVillage)

        expect(state.caravanDispatchForm.cargo).toEqual([{ itemId: 'CopperOre', quantity: 10 }])
    })

    test('caravanOnItemRemove ignores removals from a different location', () => {
        const state = stateReady()
        setCargoLineQty(state, 'OakLog', 100)

        caravanOnItemRemove(state, 'OakLog', GameLocations.WoodVillage)

        expect(state.caravanDispatchForm.cargo).toEqual([{ itemId: 'OakLog', quantity: 100 }])
    })

    test('confirmDispatch failing (insufficient gold) leaves the form intact', () => {
        const state = stateReady()
        state.gold = 0
        setCaravanDestination(state, GameLocations.WoodVillage)
        setCaravanTier(state, CaravanTierId.Standard)
        setCargoLineQty(state, 'OakLog', 100)
        const formBefore = structuredClone(state.caravanDispatchForm)

        const result = confirmDispatch(state)

        expect(result).toBe(DispatchResult.InsufficientGold)
        expect(state.caravanDispatchForm).toEqual(formBefore)
        expect(state.shipments).toEqual({ ids: [], entries: {} })
    })
})
