import { EquipSlotsEnum } from '../characters/equipSlotsEnum'

export type StorageState = Record<string, number>

export type InventoryNoQta = { [k in EquipSlotsEnum]?: { itemId: string } }
export type Loot = {
    itemId: string
    quantity: number
}

export type LootId = { id: string } & Loot
