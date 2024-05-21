import { AbstractEntityAdapter } from '../entityAdapter/entityAdapter'
import { Item } from '../items/Item'
import { getItemId2 } from './getItemId2'
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
        return getItemId2(data.stdItem, data.craftedItem)
    }
    complete(data: unknown): Loot | null {
        if (!data) return null
        if (typeof data !== 'object') return null

        if (!('quantity' in data) || typeof data.quantity !== 'number') return null

        if (
            !('stdItem' in data) ||
            typeof data.stdItem !== 'string' ||
            !('craftedItem' in data) ||
            typeof data.craftedItem !== 'string'
        )
            return null

        return data as Loot
    }
}
export const LootAdapter = new LootAdapterInt()
