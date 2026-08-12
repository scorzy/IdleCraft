import { AbstractEntityAdapter } from '../entityAdapter/entityAdapter'
import { GameLocations } from '../gameLocations/GameLocations'
import { StorageState } from '../storage/storageTypes'
import { CaravanTierId } from './CaravanConst'

export enum ShipmentStatus {
    InTransit = 'in_transit',
    Delivered = 'delivered',
    Returning = 'returning',
}

export interface Shipment {
    id: string
    tierId: CaravanTierId
    fromId: GameLocations
    toId: GameLocations
    cargo: StorageState[]
    totalVolume: number
    cargoValue: number
    departAtMs: number
    arriveAtMs: number
    costPaid: number
    status: ShipmentStatus
}

class ShipmentAdapterInt extends AbstractEntityAdapter<Shipment> {
    getId(data: Shipment): string {
        return data.id
    }
}
export const ShipmentAdapter = new ShipmentAdapterInt()
