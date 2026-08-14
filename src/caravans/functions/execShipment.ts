import { GameState } from '../../game/GameState'
import { addItem } from '../../storage/storageFunctions'
import { Timer } from '../../timers/Timer'
import { ShipmentAdapter, ShipmentStatus } from '../ShipmentState'

export function execShipment(state: GameState, timer: Timer): void {
    const shipment = ShipmentAdapter.select(state.shipments, timer.actId)
    if (!shipment) return

    const destination = shipment.status === ShipmentStatus.Returning ? shipment.fromId : shipment.toId
    for (const line of shipment.cargo) addItem(state, line.itemId, line.quantity, destination)

    ShipmentAdapter.remove(state.shipments, shipment.id)
}
