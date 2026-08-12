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
    test('spedizione in andata: consegna il cargo nel dock di destinazione e rimuove lo shipment', () => {
        const state = GetInitialGameState()
        const shipment = makeShipment()
        ShipmentAdapter.create(state.shipments, shipment)

        execShipment(state, makeTimer(shipment.id))

        expect(getLocation(state, GameLocations.WoodVillage).dock.entries.OakLog?.quantity).toBe(200)
        expect(getLocation(state, GameLocations.StartVillage).dock).toEqual({ ids: [], entries: {} })
        expect(state.shipments.ids).not.toContain(shipment.id)
    })

    test('spedizione di ritorno: consegna il cargo nel dock di origine', () => {
        const state = GetInitialGameState()
        const shipment = makeShipment({ status: ShipmentStatus.Returning })
        ShipmentAdapter.create(state.shipments, shipment)

        execShipment(state, makeTimer(shipment.id))

        expect(getLocation(state, GameLocations.StartVillage).dock.entries.OakLog?.quantity).toBe(200)
        expect(getLocation(state, GameLocations.WoodVillage).dock).toEqual({ ids: [], entries: {} })
        expect(state.shipments.ids).not.toContain(shipment.id)
    })

    test('cargo con più item consegna ogni riga', () => {
        const state = GetInitialGameState()
        const shipment = makeShipment({
            cargo: [
                { itemId: 'OakLog', quantity: 200 },
                { itemId: 'CopperOre', quantity: 50 },
            ],
        })
        ShipmentAdapter.create(state.shipments, shipment)

        execShipment(state, makeTimer(shipment.id))

        const dock = getLocation(state, GameLocations.WoodVillage).dock
        expect(dock.entries.OakLog?.quantity).toBe(200)
        expect(dock.entries.CopperOre?.quantity).toBe(50)
    })

    test('timer senza shipment corrispondente non fa nulla', () => {
        const state = GetInitialGameState()
        expect(() => execShipment(state, makeTimer('missing'))).not.toThrow()
        expect(state.shipments).toEqual({ ids: [], entries: {} })
    })
})
