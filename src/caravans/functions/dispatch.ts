import { ActivityTypes } from '../../activities/ActivityState'
import { GameState } from '../../game/GameState'
import { GameLocationAdapter } from '../../gameLocations/GameLocationAdapter'
import { GameLocations } from '../../gameLocations/GameLocations'
import { hasGold, hasItem, removeItem, spendGold } from '../../storage/storageFunctions'
import { StorageState } from '../../storage/storageTypes'
import { startTimer } from '../../timers/startTimer'
import { getUniqueId } from '../../utils/getUniqueId'
import { CaravanTierId } from '../CaravanConst'
import { Shipment, ShipmentAdapter, ShipmentStatus } from '../ShipmentState'
import { calcCargoValue, calcCost, calcDuration, calcTotalVolume } from './calcShipment'
import { getRoute, getTier } from './getRoute'

export interface DispatchParams {
    toId: GameLocations
    tierId: CaravanTierId
    cargo: StorageState[]
}

export enum DispatchResult {
    Dispatched = 'Dispatched',
    EmptyCargo = 'EmptyCargo',
    InvalidRoute = 'InvalidRoute',
    InvalidTier = 'InvalidTier',
    NoCaravanSlots = 'NoCaravanSlots',
    InsufficientCargo = 'InsufficientCargo',
    InsufficientGold = 'InsufficientGold',
}

const MS_PER_MINUTE = 60 * 1000

export function dispatch(state: GameState, params: DispatchParams): { result: DispatchResult; shipmentId?: string } {
    const { toId, tierId, cargo } = params
    const fromId = state.location

    if (cargo.length === 0 || cargo.some((line) => line.quantity <= 0)) return { result: DispatchResult.EmptyCargo }

    const route = getRoute(state, toId)
    if (!route) return { result: DispatchResult.InvalidRoute }

    const tier = getTier(tierId)
    if (!tier) return { result: DispatchResult.InvalidTier }

    const location = GameLocationAdapter.selectEx(state.locations, fromId)
    const activeCaravans = ShipmentAdapter.count(state.shipments, (shipment) => shipment.fromId === fromId)
    if (activeCaravans >= location.caravanSlots) return { result: DispatchResult.NoCaravanSlots }

    for (const line of cargo)
        if (!hasItem(state, line.itemId, line.quantity, fromId)) return { result: DispatchResult.InsufficientCargo }

    const totalVolume = calcTotalVolume(cargo, state.craftedItems)
    const cargoValue = calcCargoValue(cargo, state.craftedItems)
    const cost = calcCost(route, tier, totalVolume, cargoValue)

    if (!hasGold(state, cost)) return { result: DispatchResult.InsufficientGold }

    const durationMs = calcDuration(route, tier, totalVolume) * MS_PER_MINUTE

    // startTimer syncs state.now to the real clock (outside replay/loading), so it must run before
    // departAtMs is captured to keep the Shipment's timestamps consistent with its Timer.
    const shipmentId = getUniqueId()
    startTimer(state, durationMs, ActivityTypes.Shipment, shipmentId)
    const departAtMs = state.now

    const shipment: Shipment = {
        id: shipmentId,
        tierId,
        fromId,
        toId,
        cargo,
        totalVolume,
        cargoValue,
        departAtMs,
        arriveAtMs: departAtMs + durationMs,
        costPaid: cost,
        status: ShipmentStatus.InTransit,
    }
    // Attach the shipment (with its cargo) before removing the cargo from storage, so that a crafted
    // item leaving its last location copy is still recognized as "in use" by isCraftItemUsed.
    ShipmentAdapter.create(state.shipments, shipment)

    for (const line of cargo) removeItem(state, line.itemId, line.quantity, fromId)
    spendGold(state, cost)

    return { result: DispatchResult.Dispatched, shipmentId }
}
