import { ActivityTypes } from '../../activities/ActivityState'
import { GameState } from '../../game/GameState'
import { removeActivityTimers } from '../../timers/removeActivityTimers'
import { startTimer } from '../../timers/startTimer'
import { ShipmentAdapter, ShipmentStatus } from '../ShipmentState'

export enum RecallResult {
    Recalled = 'Recalled',
    NotFound = 'NotFound',
    NotInTransit = 'NotInTransit',
}

export function recall(state: GameState, shipmentId: string): RecallResult {
    const shipment = ShipmentAdapter.select(state.shipments, shipmentId)
    if (!shipment) return RecallResult.NotFound
    if (shipment.status !== ShipmentStatus.InTransit) return RecallResult.NotInTransit

    // state.now only advances when a timer fires or starts (see startTimer.ts); sync it to the real
    // clock here too, or elapsedMs would be computed against a stale value and read as ~0.
    if (!state.loading && !state.isTimer) state.now = Date.now()

    const elapsedMs = Math.max(0, state.now - shipment.departAtMs)

    removeActivityTimers(state, shipmentId)
    startTimer(state, elapsedMs, ActivityTypes.Shipment, shipmentId)

    shipment.status = ShipmentStatus.Returning
    shipment.departAtMs = state.now
    shipment.arriveAtMs = state.now + elapsedMs

    return RecallResult.Recalled
}
