import { EquipSlotsEnum } from './equipSlotsEnum'

export interface Inventory {
    itemId: string
    quantity?: number
}
export type CharInventory = Partial<Record<EquipSlotsEnum, Inventory>>
