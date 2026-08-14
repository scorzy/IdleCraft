import { describe, expect, test } from 'vitest'
import { GetInitialGameState } from '../../game/InitialGameState'
import { GameLocations } from '../../gameLocations/GameLocations'
import { addItem } from '../../storage/storageFunctions'
import { CaravanTierId } from '../CaravanConst'
import {
    addCargoItem,
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
    test('setCaravanDestination/setCaravanTier aggiornano il form', () => {
        const state = stateReady()
        setCaravanDestination(state, GameLocations.WoodVillage)
        setCaravanTier(state, CaravanTierId.Standard)
        expect(state.caravanDispatchForm.toId).toBe(GameLocations.WoodVillage)
        expect(state.caravanDispatchForm.tierId).toBe(CaravanTierId.Standard)
    })

    test('setCargoLineQty aggiunge, aggiorna e rimuove una riga cargo', () => {
        const state = stateReady()
        setCargoLineQty(state, 'OakLog', 100)
        expect(state.caravanDispatchForm.cargo).toEqual([{ itemId: 'OakLog', quantity: 100 }])

        setCargoLineQty(state, 'OakLog', 50)
        expect(state.caravanDispatchForm.cargo).toEqual([{ itemId: 'OakLog', quantity: 50 }])

        setCargoLineQty(state, 'OakLog', 0)
        expect(state.caravanDispatchForm.cargo).toEqual([])
    })

    test('addCargoItem precarica la quantità disponibile nello storage corrente', () => {
        const state = stateReady()
        addCargoItem(state, 'OakLog')
        expect(state.caravanDispatchForm.cargo).toEqual([{ itemId: 'OakLog', quantity: 500 }])
    })

    test('addCargoItem non aggiunge un item assente dallo storage', () => {
        const state = stateReady()
        addCargoItem(state, 'TinOre')
        expect(state.caravanDispatchForm.cargo).toEqual([])
    })

    test('removeCargoLine rimuove solo la riga indicata', () => {
        const state = stateReady()
        setCargoLineQty(state, 'OakLog', 100)
        setCargoLineQty(state, 'CopperOre', 10)
        removeCargoLine(state, 'OakLog')
        expect(state.caravanDispatchForm.cargo).toEqual([{ itemId: 'CopperOre', quantity: 10 }])
    })

    test('loadAllStorageAsCargo precarica tutto lo storage del luogo corrente', () => {
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

    test('resetCaravanForm svuota destinazione, tier e cargo', () => {
        const state = stateReady()
        setCaravanDestination(state, GameLocations.WoodVillage)
        setCaravanTier(state, CaravanTierId.Standard)
        setCargoLineQty(state, 'OakLog', 10)

        resetCaravanForm(state)

        expect(state.caravanDispatchForm).toEqual({ toId: undefined, tierId: undefined, cargo: [] })
    })

    test('confirmDispatch spedisce, svuota il form e seleziona la nuova spedizione', () => {
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

    test('confirmDispatch senza destinazione/tier non muta lo stato', () => {
        const state = stateReady()
        setCargoLineQty(state, 'OakLog', 100)
        const before = structuredClone(state)

        const result = confirmDispatch(state)

        expect(result).toBe(DispatchResult.InvalidRoute)
        expect(state).toEqual(before)
    })

    test('confirmDispatch che fallisce (oro insufficiente) lascia il form intatto', () => {
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
