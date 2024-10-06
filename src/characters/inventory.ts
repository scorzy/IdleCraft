import { EquipSlotsEnum } from './equipSlotsEnum'

export interface Inventory {
    itemId: string
    quantity?: number
}
export type CharInventory = {
    [k in EquipSlotsEnum]?: Inventory
}
