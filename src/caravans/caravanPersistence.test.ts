import { describe, expect, test } from 'vitest'
import { loadData } from '../game/loadData'
import { GetInitialGameState } from '../game/InitialGameState'
import { minifyStateKeys, restoreStateKeys } from '../game/save/stateKeyMinifier'
import { GameLocationAdapter } from '../gameLocations/GameLocationAdapter'
import { GameLocations } from '../gameLocations/GameLocations'
import { addItem } from '../storage/storageFunctions'
import { CaravanTierId, DEFAULT_CARAVAN_SLOTS, DEFAULT_UNLOCKED_CARAVAN_TIERS } from './CaravanConst'
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
    if (result !== DispatchResult.Dispatched || !shipmentId) throw new Error('dispatch di test fallito')

    return { state, shipmentId }
}

describe('persistenza carovane', () => {
    test('round-trip via loadData (path autosave IndexedDB) preserva spedizioni, slot e tier sbloccati', () => {
        const { state } = stateWithInFlightShipment()

        const restored = loadData(structuredClone(state))

        expect(restored.shipments).toEqual(state.shipments)
        expect(restored.caravanSlots).toBe(state.caravanSlots)
        expect(restored.unlockedCaravanTiers).toEqual(state.unlockedCaravanTiers)
        expect(restored.timers).toEqual(state.timers)
        expect(GameLocationAdapter.selectEx(restored.locations, GameLocations.StartVillage).storage).toEqual(
            GameLocationAdapter.selectEx(state.locations, GameLocations.StartVillage).storage
        )
    })

    test('round-trip via minify/restore (path export/import) preserva l’intero stato', () => {
        const { state } = stateWithInFlightShipment()

        const minified = minifyStateKeys(state)
        const restored = restoreStateKeys(minified)

        expect(restored).toEqual(state)
    })

    test('un salvataggio legacy senza campi carovane viene migrato con i default', () => {
        const restored = loadData({
            gold: 42,
            locations: {
                [GameLocations.StartVillage]: {
                    storage: { ids: ['OakLog'], entries: { OakLog: { itemId: 'OakLog', quantity: 3 } } },
                },
            },
        })

        expect(restored.shipments).toEqual({ ids: [], entries: {} })
        expect(restored.caravanSlots).toBe(DEFAULT_CARAVAN_SLOTS)
        expect(restored.unlockedCaravanTiers).toEqual(DEFAULT_UNLOCKED_CARAVAN_TIERS)
        expect(
            GameLocationAdapter.selectEx(restored.locations, GameLocations.StartVillage).storage.entries.OakLog
        ).toEqual({ itemId: 'OakLog', quantity: 3 })
        expect(restored.gold).toBe(42)
    })
})
