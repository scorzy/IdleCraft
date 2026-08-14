import { GameState } from '../../game/GameState'
import { GameLocations } from '../../gameLocations/GameLocations'
import { Shipment, ShipmentAdapter } from '../ShipmentState'

export function selectActiveShipments(state: GameState): Shipment[] {
    return ShipmentAdapter.findMany(state.shipments, () => true)
}

export function selectShipmentsAtLocation(state: GameState, location: GameLocations): Shipment[] {
    return ShipmentAdapter.findMany(
        state.shipments,
        (shipment) => shipment.fromId === location || shipment.toId === location
    )
}

export function selectAvailableCaravanSlots(state: GameState): number {
    return Math.max(0, state.caravanSlots - state.shipments.ids.length)
}

export function selectSelectedShipmentId(state: GameState): string | null {
    return state.ui.selectedShipmentId
}

export function selectShipment(state: GameState, id: string): Shipment | undefined {
    return ShipmentAdapter.select(state.shipments, id)
}
