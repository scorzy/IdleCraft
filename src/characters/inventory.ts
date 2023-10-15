import { EquipSlotsEnum } from './equipSlotsEnum'

export interface Inventory {
    stdItemId?: string
    craftItemId?: string
    quantity?: number
}
export type CharInventory = {
    [k in EquipSlotsEnum]?: Inventory
}
