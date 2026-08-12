import { GameState } from '../../game/GameState'
import { Timer } from '../../timers/Timer'
import { ShipmentAdapter, ShipmentStatus } from '../ShipmentState'
import { addToDock } from './dockFunctions'

export function execShipment(state: GameState, timer: Timer): void {
    const shipment = ShipmentAdapter.select(state.shipments, timer.actId)
    if (!shipment) return

    const destination = shipment.status === ShipmentStatus.Returning ? shipment.fromId : shipment.toId
    for (const line of shipment.cargo) addToDock(state, destination, line.itemId, line.quantity)

    ShipmentAdapter.remove(state.shipments, shipment.id)
}
