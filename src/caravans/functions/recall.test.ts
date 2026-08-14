import { afterEach, describe, expect, test, vi } from 'vitest'
import { ActivityTypes } from '../../activities/ActivityState'
import { GetInitialGameState } from '../../game/InitialGameState'
import { GameLocationAdapter } from '../../gameLocations/GameLocationAdapter'
import { GameLocations } from '../../gameLocations/GameLocations'
import { TimerAdapter } from '../../timers/Timer'
import { CaravanTierId } from '../CaravanConst'
import { Shipment, ShipmentAdapter, ShipmentStatus } from '../ShipmentState'
import { execShipment } from './execShipment'
import { recall, RecallResult } from './recall'

const getLocation = (state: ReturnType<typeof GetInitialGameState>, location: GameLocations) =>
    GameLocationAdapter.selectEx(state.locations, location)

function stateWithShipment(overrides: Partial<Shipment> = {}) {
    const state = GetInitialGameState()
    state.isTimer = true
    state.now = 10_000
    state.gold = 500

    const shipment: Shipment = {
        id: 'shipment1',
        tierId: CaravanTierId.Standard,
        fromId: GameLocations.StartVillage,
        toId: GameLocations.WoodVillage,
        cargo: [{ itemId: 'OakLog', quantity: 200 }],
        totalVolume: 200,
        cargoValue: 1000,
        departAtMs: 10_000,
        arriveAtMs: 30_000,
        costPaid: 10,
        status: ShipmentStatus.InTransit,
        ...overrides,
    }
    ShipmentAdapter.create(state.shipments, shipment)
    TimerAdapter.create(state.timers, {
        id: 'timer1',
        from: shipment.departAtMs,
        to: shipment.arriveAtMs,
        type: ActivityTypes.Shipment,
        actId: shipment.id,
    })

    return { state, shipment }
}

describe('recall', () => {
    afterEach(() => {
        vi.useRealTimers()
    })

    test("richiamo reale da UI (isTimer=false): sincronizza state.now sull'orologio reale prima di calcolare il tempo trascorso", () => {
        vi.useFakeTimers()
        vi.setSystemTime(10_000)

        const { state } = stateWithShipment()
        state.isTimer = false // una recall scatenata da un click reale, non da una simulazione/replay

        vi.setSystemTime(25_000) // 15s reali passano senza che nessun altro timer sincronizzi state.now

        const result = recall(state, 'shipment1')
        expect(result).toBe(RecallResult.Recalled)

        const shipment = ShipmentAdapter.select(state.shipments, 'shipment1')
        expect(state.now).toBe(25_000)
        expect(shipment?.departAtMs).toBe(25_000)
        expect(shipment?.arriveAtMs).toBe(40_000) // 25_000 + 15_000 di tempo realmente trascorso

        const timer = TimerAdapter.find(state.timers, (t) => t.actId === 'shipment1')
        expect(timer?.to).toBe(40_000)
    })

    test('richiamo a metà viaggio: nuova durata pari al tempo trascorso, nessun rimborso', () => {
        const { state } = stateWithShipment()
        state.now = 20_000 // metà tra 10_000 (partenza) e 30_000 (arrivo previsto): 10_000ms trascorsi
        const goldBefore = state.gold

        const result = recall(state, 'shipment1')
        expect(result).toBe(RecallResult.Recalled)

        const shipment = ShipmentAdapter.select(state.shipments, 'shipment1')
        expect(shipment?.status).toBe(ShipmentStatus.Returning)
        expect(shipment?.departAtMs).toBe(20_000)
        expect(shipment?.arriveAtMs).toBe(30_000) // 20_000 + 10_000 di tempo già trascorso
        expect(state.gold).toBe(goldBefore)

        const timer = TimerAdapter.find(state.timers, (t) => t.actId === 'shipment1')
        expect(timer?.to).toBe(30_000)

        execShipment(state, timer!)
        expect(getLocation(state, GameLocations.StartVillage).storage.entries.OakLog?.quantity).toBe(200)
        expect(getLocation(state, GameLocations.WoodVillage).storage).toEqual({ ids: [], entries: {} })
    })

    test('richiamo subito dopo la partenza: durata di ritorno ~0', () => {
        const { state } = stateWithShipment()
        state.now = 10_000 // nessun tempo trascorso

        recall(state, 'shipment1')
        const shipment = ShipmentAdapter.select(state.shipments, 'shipment1')
        expect(shipment?.arriveAtMs).toBe(shipment?.departAtMs)
    })

    test('shipment inesistente -> NotFound', () => {
        const state = GetInitialGameState()
        expect(recall(state, 'missing')).toBe(RecallResult.NotFound)
    })

    test('shipment già in ritorno -> NotInTransit', () => {
        const { state } = stateWithShipment({ status: ShipmentStatus.Returning })
        expect(recall(state, 'shipment1')).toBe(RecallResult.NotInTransit)
    })
})
