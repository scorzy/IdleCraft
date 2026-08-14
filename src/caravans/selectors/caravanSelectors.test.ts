import { describe, expect, test } from 'vitest'
import { GetInitialGameState } from '../../game/InitialGameState'
import { GameLocations } from '../../gameLocations/GameLocations'
import { addItem } from '../../storage/storageFunctions'
import { CaravanTierId } from '../CaravanConst'
import { dispatch, DispatchResult } from '../functions/dispatch'
import { selectActiveShipments, selectAvailableCaravanSlots, selectShipmentsAtLocation } from './caravanSelectors'

function stateReady() {
    const state = GetInitialGameState()
    state.isTimer = true
    state.gold = 1_000_000
    addItem(state, 'OakLog', 500, GameLocations.StartVillage)
    return state
}

describe('caravanSelectors', () => {
    test('selectActiveShipments returns all present shipments', () => {
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

    test('selectShipmentsAtLocation filters by origin and destination', () => {
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

    test('selectAvailableCaravanSlots scales with active shipments', () => {
        const state = stateReady()
        expect(selectAvailableCaravanSlots(state)).toBe(state.caravanSlots)

        dispatch(state, {
            toId: GameLocations.WoodVillage,
            tierId: CaravanTierId.Standard,
            cargo: [{ itemId: 'OakLog', quantity: 100 }],
        })
        expect(selectAvailableCaravanSlots(state)).toBe(state.caravanSlots - 1)
    })
})
