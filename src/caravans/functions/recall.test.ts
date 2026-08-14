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

    test('real recall from UI (isTimer=false): syncs state.now to the real clock before computing elapsed time', () => {
        vi.useFakeTimers()
        vi.setSystemTime(10_000)

        const { state } = stateWithShipment()
        state.isTimer = false // a recall triggered by a real click, not a simulation/replay

        vi.setSystemTime(25_000) // 15 real seconds pass without any other timer syncing state.now

        const result = recall(state, 'shipment1')
        expect(result).toBe(RecallResult.Recalled)

        const shipment = ShipmentAdapter.select(state.shipments, 'shipment1')
        expect(state.now).toBe(25_000)
        expect(shipment?.departAtMs).toBe(25_000)
        expect(shipment?.arriveAtMs).toBe(40_000) // 25_000 + 15_000 of actually elapsed time

        const timer = TimerAdapter.find(state.timers, (t) => t.actId === 'shipment1')
        expect(timer?.to).toBe(40_000)
    })

    test('recall halfway through the trip: new duration equal to elapsed time, no refund', () => {
        const { state } = stateWithShipment()
        state.now = 20_000 // halfway between 10_000 (departure) and 30_000 (expected arrival): 10_000ms elapsed
        const goldBefore = state.gold

        const result = recall(state, 'shipment1')
        expect(result).toBe(RecallResult.Recalled)

        const shipment = ShipmentAdapter.select(state.shipments, 'shipment1')
        expect(shipment?.status).toBe(ShipmentStatus.Returning)
        expect(shipment?.departAtMs).toBe(20_000)
        expect(shipment?.arriveAtMs).toBe(30_000) // 20_000 + 10_000 of already elapsed time
        expect(state.gold).toBe(goldBefore)

        const timer = TimerAdapter.find(state.timers, (t) => t.actId === 'shipment1')
        expect(timer?.to).toBe(30_000)

        execShipment(state, timer!)
        expect(getLocation(state, GameLocations.StartVillage).storage.entries.OakLog?.quantity).toBe(200)
        expect(getLocation(state, GameLocations.WoodVillage).storage).toEqual({ ids: [], entries: {} })
    })

    test('recall right after departure: return duration ~0', () => {
        const { state } = stateWithShipment()
        state.now = 10_000 // no time elapsed

        recall(state, 'shipment1')
        const shipment = ShipmentAdapter.select(state.shipments, 'shipment1')
        expect(shipment?.arriveAtMs).toBe(shipment?.departAtMs)
    })

    test('nonexistent shipment -> NotFound', () => {
        const state = GetInitialGameState()
        expect(recall(state, 'missing')).toBe(RecallResult.NotFound)
    })

    test('shipment already returning -> NotInTransit', () => {
        const { state } = stateWithShipment({ status: ShipmentStatus.Returning })
        expect(recall(state, 'shipment1')).toBe(RecallResult.NotInTransit)
    })
})
