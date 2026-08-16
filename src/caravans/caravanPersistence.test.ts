import { describe, expect, test } from 'vitest'
import { loadData } from '../game/loadData'
import { GetInitialGameState } from '../game/InitialGameState'
import { minifyStateKeys, restoreStateKeys } from '../game/save/stateKeyMinifier'
import { GameLocationAdapter } from '../gameLocations/GameLocationAdapter'
import { GameLocations } from '../gameLocations/GameLocations'
import { addItem } from '../storage/storageFunctions'
import { CaravanTierId, DEFAULT_CARAVAN_SLOTS } from './CaravanConst'
import { dispatch, DispatchResult } from './functions/dispatch'

function stateWithInFlightShipment() {
    const state = GetInitialGameState()
    state.isTimer = true
    state.gold = 1_000_000
    addItem(state, 'OakLog', 500, GameLocations.StartVillage)

    const { result, shipmentId } = dispatch(state, {
        toId: GameLocations.WoodVillage,
        tierId: CaravanTierId.Standard,
        cargo: [{ itemId: 'OakLog', quantity: 200 }],
    })
    if (result !== DispatchResult.Dispatched || !shipmentId) throw new Error('dispatch test failed')

    return { state, shipmentId }
}

describe('save', () => {
    test('round-trip via loadData (autosave IndexedDB path)', () => {
        const { state } = stateWithInFlightShipment()

        const restored = loadData(structuredClone(state))

        expect(restored.shipments).toEqual(state.shipments)
        expect(GameLocationAdapter.selectEx(restored.locations, GameLocations.StartVillage).caravanSlots).toBe(
            GameLocationAdapter.selectEx(state.locations, GameLocations.StartVillage).caravanSlots
        )
        expect(restored.timers).toEqual(state.timers)
        expect(GameLocationAdapter.selectEx(restored.locations, GameLocations.StartVillage).storage).toEqual(
            GameLocationAdapter.selectEx(state.locations, GameLocations.StartVillage).storage
        )
    })

    test('round-trip via minify/restore (export/import path) preserves the whole state', () => {
        const { state } = stateWithInFlightShipment()

        const minified = minifyStateKeys(state)
        const restored = restoreStateKeys(minified)

        expect(restored).toEqual(state)
    })

    test('a legacy save without caravan fields is migrated with defaults', () => {
        const restored = loadData({
            gold: 42,
            locations: {
                [GameLocations.StartVillage]: {
                    storage: { ids: ['OakLog'], entries: { OakLog: { itemId: 'OakLog', quantity: 3 } } },
                },
            },
        })

        expect(restored.shipments).toEqual({ ids: [], entries: {} })
        expect(GameLocationAdapter.selectEx(restored.locations, GameLocations.StartVillage).caravanSlots).toBe(
            DEFAULT_CARAVAN_SLOTS
        )
        expect(
            GameLocationAdapter.selectEx(restored.locations, GameLocations.StartVillage).storage.entries.OakLog
        ).toEqual({ itemId: 'OakLog', quantity: 3 })
        expect(restored.gold).toBe(42)
    })

    test('a legacy global caravan slot count is migrated to the current location', () => {
        const restored = loadData({
            location: GameLocations.WoodVillage,
            caravanSlots: 3,
        })

        expect(GameLocationAdapter.selectEx(restored.locations, GameLocations.WoodVillage).caravanSlots).toBe(3)
        expect(GameLocationAdapter.selectEx(restored.locations, GameLocations.StartVillage).caravanSlots).toBe(
            DEFAULT_CARAVAN_SLOTS
        )
    })
})
