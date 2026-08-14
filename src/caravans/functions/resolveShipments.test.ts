import { describe, expect, test } from 'vitest'
import { ActivityTypes } from '../../activities/ActivityState'
import { GetInitialGameState } from '../../game/InitialGameState'
import { initialize } from '../../game/functions/initialize'
import { GameLocationAdapter } from '../../gameLocations/GameLocationAdapter'
import { GameLocations } from '../../gameLocations/GameLocations'
import { TimerAdapter } from '../../timers/Timer'
import { CaravanTierId } from '../CaravanConst'
import { Shipment, ShipmentAdapter, ShipmentStatus } from '../ShipmentState'
import { resolveShipments } from './resolveShipments'

// onTimer (called by resolveShipments) also drives regenerate()/updateQuests(), which needs the real
// registries populated exactly like production does at startup.
initialize()

const getLocation = (state: ReturnType<typeof GetInitialGameState>, location: GameLocations) =>
    GameLocationAdapter.selectEx(state.locations, location)

function addShipment(
    state: ReturnType<typeof GetInitialGameState>,
    id: string,
    itemId: string,
    arriveAtMs: number
): void {
    const shipment: Shipment = {
        id,
        tierId: CaravanTierId.Standard,
        fromId: GameLocations.StartVillage,
        toId: GameLocations.WoodVillage,
        cargo: [{ itemId, quantity: 10 }],
        totalVolume: 10,
        cargoValue: 100,
        departAtMs: 0,
        arriveAtMs,
        costPaid: 1,
        status: ShipmentStatus.InTransit,
    }
    ShipmentAdapter.create(state.shipments, shipment)
    TimerAdapter.create(state.timers, {
        id: `timer-${id}`,
        from: 0,
        to: arriveAtMs,
        type: ActivityTypes.Shipment,
        actId: id,
    })
}

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000

describe('resolveShipments', () => {
    test('offline: tre spedizioni scaglionate risolte in ordine cronologico dopo 3 giorni, senza duplicazioni', () => {
        const state = GetInitialGameState()
        state.isTimer = true
        state.now = 0
        addShipment(state, 's1', 'OakLog', 1000)
        addShipment(state, 's2', 'CopperOre', 2000)
        addShipment(state, 's3', 'TinOre', 3000)

        resolveShipments(state, THREE_DAYS_MS)

        expect(state.shipments).toEqual({ ids: [], entries: {} })
        const storage = getLocation(state, GameLocations.WoodVillage).storage
        expect(storage.entries.OakLog?.quantity).toBe(10)
        expect(storage.entries.CopperOre?.quantity).toBe(10)
        expect(storage.entries.TinOre?.quantity).toBe(10)
        expect(state.now).toBe(3000)

        // seconda chiamata: nessun timer di tipo Shipment rimasto, nessuna duplicazione
        resolveShipments(state, THREE_DAYS_MS)
        const storageAfter = getLocation(state, GameLocations.WoodVillage).storage
        expect(storageAfter.entries.OakLog?.quantity).toBe(10)
    })

    test('risolve in ordine cronologico: a metà percorso solo le prime spedizioni sono consegnate', () => {
        const state = GetInitialGameState()
        state.isTimer = true
        state.now = 0
        addShipment(state, 's1', 'OakLog', 1000)
        addShipment(state, 's2', 'CopperOre', 2000)
        addShipment(state, 's3', 'TinOre', 3000)

        resolveShipments(state, 1500)

        expect(state.shipments.ids).toEqual(['s2', 's3'])
        const storage = getLocation(state, GameLocations.WoodVillage).storage
        expect(storage.entries.OakLog?.quantity).toBe(10)
        expect(storage.entries.CopperOre).toBeUndefined()
    })

    test('clock indietro: nessuna risoluzione, nessun crash', () => {
        const state = GetInitialGameState()
        state.isTimer = true
        state.now = 5000
        addShipment(state, 's1', 'OakLog', 1000)

        expect(() => resolveShipments(state, 1000)).not.toThrow()

        expect(state.now).toBe(5000)
        expect(state.shipments.ids).toEqual(['s1'])
        const storage = getLocation(state, GameLocations.WoodVillage).storage
        expect(storage).toEqual({ ids: [], entries: {} })
    })
})
