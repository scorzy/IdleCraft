import { AbstractEntityAdapter } from '../entityAdapter/entityAdapter'
import { Item } from '../items/Item'
import { Loot } from './storageState'

class ItemAdapterInt extends AbstractEntityAdapter<Item> {
    getId(data: Item): string {
        return data.id
    }
    complete(data: unknown): Item | null {
        if (!data) return null
        if (typeof data !== 'object') return null
        if (!('id' in data)) return null

        return data as Item
    }
}
export const ItemAdapter = new ItemAdapterInt()

class LootAdapterInt extends AbstractEntityAdapter<Loot> {
    getId(data: Loot): string {
        return data.itemId
    }
    complete(data: unknown): Loot | null {
        if (!data) return null
        if (typeof data !== 'object') return null

        if (!('quantity' in data) || typeof data.quantity !== 'number') return null
        if (!('itemId' in data) || typeof data.itemId !== 'string') return null

        return data as Loot
    }
}
export const LootAdapter = new LootAdapterInt()
