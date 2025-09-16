import { EquipSlotsEnum } from '../characters/equipSlotsEnum'

export interface StorageState {
    itemId: string
    quantity: number
}

export type InventoryNoQta = Partial<Record<EquipSlotsEnum, { itemId: string }>>
export interface Loot {
    itemId: string
    quantity: number
}

export type LootId = { id: string } & Loot
