import { GameState } from '../../game/GameState'
import { GameLocationAdapter } from '../../gameLocations/GameLocationAdapter'
import { GameLocations } from '../../gameLocations/GameLocations'
import { StorageAdapter } from '../../storage/storageAdapter'
import { StorageState } from '../../storage/storageTypes'
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

export function selectDockEntries(state: GameState, location: GameLocations): StorageState[] {
    const dock = GameLocationAdapter.selectEx(state.locations, location).dock
    return StorageAdapter.findMany(dock, () => true)
}
