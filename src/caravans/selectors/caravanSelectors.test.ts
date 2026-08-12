import { describe, expect, test } from 'vitest'
import { GetInitialGameState } from '../../game/InitialGameState'
import { GameLocations } from '../../gameLocations/GameLocations'
import { addItem } from '../../storage/storageFunctions'
import { CaravanTierId } from '../CaravanConst'
import { addToDock } from '../functions/dockFunctions'
import { dispatch, DispatchResult } from '../functions/dispatch'
import {
    selectActiveShipments,
    selectAvailableCaravanSlots,
    selectDockEntries,
    selectShipmentsAtLocation,
} from './caravanSelectors'

function stateReady() {
    const state = GetInitialGameState()
    state.isTimer = true
    state.gold = 1_000_000
    addItem(state, 'OakLog', 500, GameLocations.StartVillage)
    return state
}

describe('caravanSelectors', () => {
    test('selectActiveShipments restituisce tutte le spedizioni presenti', () => {
        const state = stateReady()
        expect(selectActiveShipments(state)).toEqual([])

        const { result } = dispatch(state, {
            toId: GameLocations.WoodVillage,
            tierId: CaravanTierId.Standard,
            cargo: [{ itemId: 'OakLog', quantity: 100 }],
        })
        expect(result).toBe(DispatchResult.Dispatched)
        expect(selectActiveShipments(state)).toHaveLength(1)
    })

    test('selectShipmentsAtLocation filtra per origine e destinazione', () => {
        const state = stateReady()
        dispatch(state, {
            toId: GameLocations.WoodVillage,
            tierId: CaravanTierId.Standard,
            cargo: [{ itemId: 'OakLog', quantity: 100 }],
        })

        expect(selectShipmentsAtLocation(state, GameLocations.StartVillage)).toHaveLength(1)
        expect(selectShipmentsAtLocation(state, GameLocations.WoodVillage)).toHaveLength(1)
        expect(selectShipmentsAtLocation(state, GameLocations.Test)).toHaveLength(0)
    })

    test('selectAvailableCaravanSlots scala con le spedizioni attive', () => {
        const state = stateReady()
        expect(selectAvailableCaravanSlots(state)).toBe(state.caravanSlots)

        dispatch(state, {
            toId: GameLocations.WoodVillage,
            tierId: CaravanTierId.Standard,
            cargo: [{ itemId: 'OakLog', quantity: 100 }],
        })
        expect(selectAvailableCaravanSlots(state)).toBe(state.caravanSlots - 1)
    })

    test('selectDockEntries espone il contenuto del dock di un luogo', () => {
        const state = stateReady()
        addToDock(state, GameLocations.WoodVillage, 'OakLog', 5)
        expect(selectDockEntries(state, GameLocations.WoodVillage)).toEqual([{ itemId: 'OakLog', quantity: 5 }])
        expect(selectDockEntries(state, GameLocations.StartVillage)).toEqual([])
    })
})
