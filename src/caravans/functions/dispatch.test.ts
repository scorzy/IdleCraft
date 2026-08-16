import { describe, expect, test } from 'vitest'
import { CRAFTED_ITEM_PREFIX } from '../../const'
import { GetInitialGameState } from '../../game/InitialGameState'
import { GameLocationAdapter } from '../../gameLocations/GameLocationAdapter'
import { GameLocations } from '../../gameLocations/GameLocations'
import { Icons } from '../../icons/Icons'
import { ItemTypes } from '../../items/Item'
import { addItem } from '../../storage/storageFunctions'
import { TimerAdapter } from '../../timers/Timer'
import { CaravanTierId } from '../CaravanConst'
import { ShipmentAdapter, ShipmentStatus } from '../ShipmentState'
import { calcCargoValue, calcCost, calcTotalVolume } from './calcShipment'
import { dispatch, DispatchResult } from './dispatch'
import { getRoute, getTier } from './getRoute'

const getLocation = (state: ReturnType<typeof GetInitialGameState>, location = GameLocations.StartVillage) =>
    GameLocationAdapter.selectEx(state.locations, location)

function stateReady() {
    const state = GetInitialGameState()
    state.isTimer = true
    state.gold = 1_000_000
    addItem(state, 'OakLog', 500, GameLocations.StartVillage)
    return state
}

describe('dispatch', () => {
    test('successful dispatch: subtracts cargo and gold, creates Shipment and Timer', () => {
        const state = stateReady()
        const route = getRoute(state, GameLocations.WoodVillage)
        const tier = getTier(CaravanTierId.Standard)
        if (!route || !tier) throw new Error('missing test route/tier')

        const cargo = [{ itemId: 'OakLog', quantity: 200 }]
        const totalVolume = calcTotalVolume(cargo, state.craftedItems)
        const cargoValue = calcCargoValue(cargo, state.craftedItems)
        const expectedCost = calcCost(route, tier, totalVolume, cargoValue)

        const { result, shipmentId } = dispatch(state, {
            toId: GameLocations.WoodVillage,
            tierId: CaravanTierId.Standard,
            cargo,
        })

        expect(result).toBe(DispatchResult.Dispatched)
        expect(shipmentId).toBeDefined()

        expect(getLocation(state).storage.entries.OakLog?.quantity).toBe(300)
        expect(state.gold).toBeCloseTo(1_000_000 - expectedCost)

        const shipment = ShipmentAdapter.select(state.shipments, shipmentId!)
        expect(shipment).toBeDefined()
        expect(shipment?.status).toBe(ShipmentStatus.InTransit)
        expect(shipment?.fromId).toBe(GameLocations.StartVillage)
        expect(shipment?.toId).toBe(GameLocations.WoodVillage)
        expect(shipment?.cargo).toEqual(cargo)
        expect(shipment?.costPaid).toBeCloseTo(expectedCost)
        expect(shipment?.arriveAtMs).toBeGreaterThan(shipment!.departAtMs)

        const timer = TimerAdapter.find(state.timers, (t) => t.actId === shipmentId)
        expect(timer).toBeDefined()
        expect(timer?.to).toBe(shipment?.arriveAtMs)
    })

    test('empty cargo -> rejected, no mutation', () => {
        const state = stateReady()
        const before = structuredClone(state)

        const { result } = dispatch(state, {
            toId: GameLocations.WoodVillage,
            tierId: CaravanTierId.Standard,
            cargo: [],
        })

        expect(result).toBe(DispatchResult.EmptyCargo)
        expect(state).toEqual(before)
    })

    test('nonexistent route -> rejected', () => {
        const state = stateReady()
        const { result } = dispatch(state, {
            toId: GameLocations.Test,
            tierId: CaravanTierId.Standard,
            cargo: [{ itemId: 'OakLog', quantity: 1 }],
        })
        expect(result).toBe(DispatchResult.InvalidRoute)
    })

    test('no caravan slot available -> rejected', () => {
        const state = stateReady()
        getLocation(state).caravanSlots = 1
        const first = dispatch(state, {
            toId: GameLocations.WoodVillage,
            tierId: CaravanTierId.Standard,
            cargo: [{ itemId: 'OakLog', quantity: 1 }],
        })
        expect(first.result).toBe(DispatchResult.Dispatched)

        const second = dispatch(state, {
            toId: GameLocations.WoodVillage,
            tierId: CaravanTierId.Standard,
            cargo: [{ itemId: 'OakLog', quantity: 1 }],
        })
        expect(second.result).toBe(DispatchResult.NoCaravanSlots)
    })

    test('insufficient cargo in storage -> rejected, no mutation', () => {
        const state = stateReady()
        const before = structuredClone(state)

        const { result } = dispatch(state, {
            toId: GameLocations.WoodVillage,
            tierId: CaravanTierId.Standard,
            cargo: [{ itemId: 'OakLog', quantity: 10_000 }],
        })

        expect(result).toBe(DispatchResult.InsufficientCargo)
        expect(state).toEqual(before)
    })

    test('insufficient gold -> rejected, no mutation', () => {
        const state = stateReady()
        state.gold = 0
        const before = structuredClone(state)

        const { result } = dispatch(state, {
            toId: GameLocations.WoodVillage,
            tierId: CaravanTierId.Standard,
            cargo: [{ itemId: 'OakLog', quantity: 200 }],
        })

        expect(result).toBe(DispatchResult.InsufficientGold)
        expect(state).toEqual(before)
    })

    test('a crafted item shipped as the last copy survives in state.craftedItems', () => {
        const state = stateReady()
        const craftedId = `${CRAFTED_ITEM_PREFIX}sword`
        addItem(state, craftedId, 1, GameLocations.StartVillage)
        state.craftedItems = {
            ids: [craftedId],
            entries: {
                [craftedId]: {
                    id: craftedId,
                    icon: Icons.Sword,
                    nameId: 'LongSword',
                    type: ItemTypes.OneHand,
                    value: 100,
                    volume: 0.1,
                },
            },
        }

        const { result } = dispatch(state, {
            toId: GameLocations.WoodVillage,
            tierId: CaravanTierId.Standard,
            cargo: [{ itemId: craftedId, quantity: 1 }],
        })

        expect(result).toBe(DispatchResult.Dispatched)
        expect(getLocation(state).storage.entries[craftedId]).toBeUndefined()
        expect(state.craftedItems.ids).toContain(craftedId)
    })
})
