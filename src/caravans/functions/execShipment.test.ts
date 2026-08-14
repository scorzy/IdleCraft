import { describe, expect, test } from 'vitest'
import { ActivityTypes } from '../../activities/ActivityState'
import { GetInitialGameState } from '../../game/InitialGameState'
import { GameLocationAdapter } from '../../gameLocations/GameLocationAdapter'
import { GameLocations } from '../../gameLocations/GameLocations'
import { Timer } from '../../timers/Timer'
import { CaravanTierId } from '../CaravanConst'
import { Shipment, ShipmentAdapter, ShipmentStatus } from '../ShipmentState'
import { execShipment } from './execShipment'

const getLocation = (state: ReturnType<typeof GetInitialGameState>, location: GameLocations) =>
    GameLocationAdapter.selectEx(state.locations, location)

function makeShipment(overrides: Partial<Shipment> = {}): Shipment {
    return {
        id: 'shipment1',
        tierId: CaravanTierId.Standard,
        fromId: GameLocations.StartVillage,
        toId: GameLocations.WoodVillage,
        cargo: [{ itemId: 'OakLog', quantity: 200 }],
        totalVolume: 200,
        cargoValue: 1000,
        departAtMs: 0,
        arriveAtMs: 1000,
        costPaid: 10,
        status: ShipmentStatus.InTransit,
        ...overrides,
    }
}

function makeTimer(actId: string): Timer {
    return { id: 'timer1', from: 0, to: 1000, type: ActivityTypes.Shipment, actId }
}

describe('execShipment', () => {
    test('outbound shipment: delivers cargo to the destination storage and removes the shipment', () => {
        const state = GetInitialGameState()
        const shipment = makeShipment()
        ShipmentAdapter.create(state.shipments, shipment)

        execShipment(state, makeTimer(shipment.id))

        expect(getLocation(state, GameLocations.WoodVillage).storage.entries.OakLog?.quantity).toBe(200)
        expect(getLocation(state, GameLocations.StartVillage).storage).toEqual({ ids: [], entries: {} })
        expect(state.shipments.ids).not.toContain(shipment.id)
    })

    test('return shipment: delivers cargo to the origin storage', () => {
        const state = GetInitialGameState()
        const shipment = makeShipment({ status: ShipmentStatus.Returning })
        ShipmentAdapter.create(state.shipments, shipment)

        execShipment(state, makeTimer(shipment.id))

        expect(getLocation(state, GameLocations.StartVillage).storage.entries.OakLog?.quantity).toBe(200)
        expect(getLocation(state, GameLocations.WoodVillage).storage).toEqual({ ids: [], entries: {} })
        expect(state.shipments.ids).not.toContain(shipment.id)
    })

    test('cargo with multiple items delivers every line', () => {
        const state = GetInitialGameState()
        const shipment = makeShipment({
            cargo: [
                { itemId: 'OakLog', quantity: 200 },
                { itemId: 'CopperOre', quantity: 50 },
            ],
        })
        ShipmentAdapter.create(state.shipments, shipment)

        execShipment(state, makeTimer(shipment.id))

        const storage = getLocation(state, GameLocations.WoodVillage).storage
        expect(storage.entries.OakLog?.quantity).toBe(200)
        expect(storage.entries.CopperOre?.quantity).toBe(50)
    })

    test('the delivery adds up to an item already present in the destination storage', () => {
        const state = GetInitialGameState()
        getLocation(state, GameLocations.WoodVillage).storage = {
            ids: ['OakLog'],
            entries: { OakLog: { itemId: 'OakLog', quantity: 50 } },
        }
        const shipment = makeShipment()
        ShipmentAdapter.create(state.shipments, shipment)

        execShipment(state, makeTimer(shipment.id))

        expect(getLocation(state, GameLocations.WoodVillage).storage.entries.OakLog?.quantity).toBe(250)
    })

    test('timer without a matching shipment does nothing', () => {
        const state = GetInitialGameState()
        expect(() => execShipment(state, makeTimer('missing'))).not.toThrow()
        expect(state.shipments).toEqual({ ids: [], entries: {} })
    })
})
