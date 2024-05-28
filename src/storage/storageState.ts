import { EquipSlotsEnum } from '../characters/equipSlotsEnum'

export interface ItemId {
    stdItemId: string | null
    craftItemId: string | null
}
export interface StorageState {
    stdItems: Record<string, number>
    craftedItems: Record<string, number>
}
export type InventoryNoQta = { [k in EquipSlotsEnum]?: { stdItemId?: string; craftItemId?: string } }
export type Loot = {
    stdItem: string | null
    craftedItem: string | null
    quantity: number
}

export type LootId = { id: string } & Loot
